"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";

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

const IMAGE_DIRECTORY = path.join(process.cwd(), "public", "equipment-images");

const ALLOWED_TYPES = new Map([
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
]);

const MAX_BYTES = 5 * 1024 * 1024;

async function saveEquipmentImage(file: File) {
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

  await mkdir(IMAGE_DIRECTORY, { recursive: true });

  const filename = `${randomUUID()}${extension}`;
  const filePath = path.join(IMAGE_DIRECTORY, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return `/equipment-images/${filename}`;
}

async function deleteEquipmentImage(imagePath?: string | null) {
  if (!imagePath || !imagePath.startsWith("/equipment-images/")) {
    return;
  }

  const fileName = path.basename(imagePath);
  const filePath = path.join(IMAGE_DIRECTORY, fileName);

  try {
    await unlink(filePath);
  } catch {
    // Ignore missing files so edits do not fail on stale references.
  }
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

  let picture: string | undefined;
  if (pictureFile instanceof File && pictureFile.size > 0) {
    picture = await saveEquipmentImage(pictureFile);
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

  let picture: string | null | undefined =
    existingEquipment.picture ?? undefined;
  if (pictureFile instanceof File && pictureFile.size > 0) {
    picture = await saveEquipmentImage(pictureFile);
    await deleteEquipmentImage(existingEquipment.picture);
  } else if (deletePicture) {
    await deleteEquipmentImage(existingEquipment.picture);
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

  await deleteEquipmentById(equipmentId);
  await deleteEquipmentImage(existingEquipment.picture);

  revalidatePath("/equipment");
  revalidatePath("/");
}
