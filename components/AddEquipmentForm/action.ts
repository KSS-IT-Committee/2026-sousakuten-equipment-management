"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";

import { createEquipment } from "@/db/queries/equipments";

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
