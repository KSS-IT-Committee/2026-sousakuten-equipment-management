"use server";

import { eq } from "drizzle-orm";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import path from "path";

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

  const file = formData.get("picture") as File | null;
  let pictureBase64: string | null = null;

  if (!name) {
    throw new Error("error: equipment name is required");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("error: quantity must be a positive integer");
  }

  if (file && file.size > 0 && file.name !== "undefined") {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    pictureBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;
  }

  const result = await createEquipment({
    name,
    quantity,
    picture: pictureBase64,
  });

  revalidatePath("/equipment");
  revalidatePath("/");
  return result;
}

export async function updateEquipmentAction(formData: FormData) {
  const equipmentId = Number(formData.get("equipmentId"));
  const name = String(formData.get("name") ?? "").trim();
  const quantity = Number(formData.get("quantity"));

  const file = formData.get("picture") as File | null;
  let pictureBase64: string | null = null;

  if (!Number.isInteger(equipmentId) || equipmentId <= 0) {
    throw new Error("error: equipment ID is invalid");
  }

  const existingEquipment = await getEquipmentById(equipmentId);
  if (!existingEquipment) {
    throw new Error("error: equipment not found");
  }

  if (!name) {
    throw new Error("error: equipment name is required");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("error: quantity must be a positive integer");
  }

  const activeBorrowings = await getActiveBorrowingsByEquipmentId(equipmentId);
  if (quantity < activeBorrowings.length) {
    throw new Error(
      `現在貸出中の数 (${activeBorrowings.length}件) を下回る数量には変更できません`,
    );
  }

  if (file && file.size > 0 && file.name !== "undefined") {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    pictureBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;
  }

  const updateData: {
    name: string;
    quantity: number;
    picture?: string | null;
  } = {
    name,
    quantity,
  };

  if (pictureBase64) {
    updateData.picture = pictureBase64;
  } else if (file && file.size === 0) {
    updateData.picture = null;
  }

  const result = await updateEquipment(equipmentId, updateData);

  revalidatePath("/equipment");
  revalidatePath("/");
  return result;
}

export async function deleteEquipmentAction(
  equipmentId: number,
): Promise<{ success: boolean; error?: string }> {
  if (!Number.isInteger(equipmentId) || equipmentId <= 0) {
    return { success: false, error: "備品IDが不正です" };
  }

  try {
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

      await tx.delete(Equipments).where(eq(Equipments.id, equipmentId));
    });
    revalidatePath("/equipment");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "データベース処理中にエラーが発生しました",
    };
  }
}
export async function getAvailableImages(): Promise<string[]> {
  const imageDir = path.join(process.cwd(), "public", "equipment-images");

  const files = await fs.readdir(imageDir);
  return files
    .filter((file) => /\.(png|jpe?g|webp|gif|svg)$/i.test(file))
    .map((file) => `/equipment-images/${file}`);
}
