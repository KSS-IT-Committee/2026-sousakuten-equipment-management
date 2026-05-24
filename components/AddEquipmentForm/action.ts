"use server";

import { revalidatePath } from "next/cache";
import path from "node:path";

import {
  getActiveBorrowingsByID,
  getBorrowingsByEquipmentId,
} from "@/db/queries/borrowings";
import {
  createEquipment,
  deleteEquipmentById,
  getEquipmentById,
  updateEquipment,
} from "@/db/queries/equipments";

const ALLOWED_TYPES = new Map([
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
]);

const MAX_BYTES = 5 * 1024 * 1024;

async function processEquipmentImage(file: File): Promise<Buffer> {
  if (file.size > MAX_BYTES) {
    throw new Error("画像サイズは5MB以下にしてください");
  }

  const extension = path.extname(file.name).toLowerCase();
  const expectedMimeType = ALLOWED_TYPES.get(extension);

  if (!expectedMimeType || file.type !== expectedMimeType) {
    throw new Error(
      "許可されていないファイル形式です。PNG, JPG, WEBPのみアップロード可能です。",
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function createEquipmentAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const quantity = Number(formData.get("quantity"));
  const pictureFile = formData.get("picture");

  if (!name) {
    throw new Error("機器名を入力してください");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("数量は1以上の数字を入力してください");
  }

  // DBの型に合わせて Buffer | undefined に変更
  let picture: Buffer | undefined;
  if (pictureFile instanceof File && pictureFile.size > 0) {
    picture = await processEquipmentImage(pictureFile);
  }

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
  const pictureFile = formData.get("picture");
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

  const activeBorrowings = await getActiveBorrowingsByID(equipmentId);
  if (quantity < activeBorrowings.length) {
    throw new Error(
      `現在貸出中の数 (${activeBorrowings.length}件) を下回る数量には変更できません`,
    );
  }

  // existingEquipment.picture の型は Buffer | null になります
  let picture: Buffer | null | undefined =
    existingEquipment.picture ?? undefined;

  if (pictureFile instanceof File && pictureFile.size > 0) {
    picture = await processEquipmentImage(pictureFile);
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

  const existingEquipment = await getEquipmentById(equipmentId);
  if (!existingEquipment) {
    throw new Error("備品が見つかりませんでした");
  }

  const borrowings = await getBorrowingsByEquipmentId(equipmentId);
  if (borrowings.length > 0) {
    throw new Error("貸出履歴がある備品は削除できません");
  }

  // レコードを削除するだけでバイナリデータ（画像）も一緒に消えます
  await deleteEquipmentById(equipmentId);

  revalidatePath("/equipment");
  revalidatePath("/");
}
