"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";

import { getBorrowingsByEquipmentId } from "@/db/queries/borrowings";
import {
  createEquipment,
  deleteEquipmentById,
  getEquipmentById,
  updateEquipment,
} from "@/db/queries/equipments";

const IMAGE_DIRECTORY = path.join(process.cwd(), "public", "equipment-images");

async function saveEquipmentImage(file: File) {
  await mkdir(IMAGE_DIRECTORY, { recursive: true });

  const extension = path.extname(file.name).toLowerCase() || ".png";
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

  const filePath = path.join(process.cwd(), "public", imagePath.slice(1));

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
    if (!pictureFile.type.startsWith("image/")) {
      throw new Error("画像ファイルを選択してください");
    }

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

  let picture = existingEquipment.picture ?? undefined;
  if (pictureFile instanceof File && pictureFile.size > 0) {
    if (!pictureFile.type.startsWith("image/")) {
      throw new Error("画像ファイルを選択してください");
    }

    picture = await saveEquipmentImage(pictureFile);
    await deleteEquipmentImage(existingEquipment.picture);
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
