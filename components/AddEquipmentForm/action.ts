"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getActiveBorrowingsByEquipmentId } from "@/db/queries/borrowings";
import {
  createEquipment,
  getEquipmentById,
  updateEquipment,
} from "@/db/queries/equipments";
import { Borrowings, Equipments } from "@/db/schema";
import { db } from "@/lib/db";

export async function createEquipmentAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const quantity = Number(formData.get("quantity"));
  // picture is now expected to be an image path string
  const picturePath = String(formData.get("picture") ?? "").trim();

  if (!name) {
    throw new Error("機器名を入力してください");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("数量は1以上の数字を入力してください");
  }

  const picture = picturePath ? picturePath : null;

  const result = await createEquipment({
    name,
    quantity,
    picture,
  });

  revalidatePath("/equipment");
  revalidatePath("/");
  return result;
}

export async function updateEquipmentAction(formData: FormData) {
  const equipmentId = Number(formData.get("equipmentId"));
  const name = String(formData.get("name") ?? "").trim();
  const quantity = Number(formData.get("quantity"));
  const picturePath = String(formData.get("picture") ?? "").trim();
  const deletePicture = formData.get("deletePicture") === "true";

  if (!Number.isInteger(equipmentId) || equipmentId <= 0) {
    throw new Error("備品IDが不正です");
  }

  const existingEquipment = await getEquipmentById(equipmentId);
  if (!existingEquipment) {
    throw new Error("備品が見つかりませんでした");
  }

  if (!name) {
    throw new Error("機器名を入力してください");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("数量は1以上の数字を入力してください");
  }

  const activeBorrowings = await getActiveBorrowingsByEquipmentId(equipmentId);
  if (quantity < activeBorrowings.length) {
    throw new Error(
      `現在貸出中の数 (${activeBorrowings.length}件) を下回る数量には変更できません`,
    );
  }

  let picture: string | null = existingEquipment.picture ?? null;

  if (picturePath) {
    picture = picturePath;
  } else if (deletePicture) {
    picture = null;
  }

  const result = await updateEquipment(equipmentId, {
    name,
    quantity,
    picture,
  });

  revalidatePath("/equipment");
  revalidatePath("/");
  return result;
}

export async function deleteEquipmentAction(equipmentId: number) {
  if (!Number.isInteger(equipmentId) || equipmentId <= 0) {
    throw new Error("備品IDが不正です");
  }

  await db.transaction(async (tx) => {
    const [existingEquipment] = await tx
      .select()
      .from(Equipments)
      .where(eq(Equipments.id, equipmentId))
      .for("update");

    if (!existingEquipment) {
      throw new Error("備品が見つかりませんでした");
    }

    const borrowings = await tx
      .select({ id: Borrowings.id })
      .from(Borrowings)
      .where(eq(Borrowings.equipmentId, equipmentId));

    if (borrowings.length > 0) {
      throw new Error("貸出履歴がある備品は削除できません");
    }

    // レコードを削除するだけでバイナリデータ（画像）も一緒に消えます
    await tx.delete(Equipments).where(eq(Equipments.id, equipmentId));
  });

  revalidatePath("/equipment");
  revalidatePath("/");
}
