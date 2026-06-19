// action.ts
"use server";

import fs from "fs/promises";
import path from "path";

async function saveImage(file: File): Promise<string | null> {
  if (!file || file.size === 0 || file.name === "undefined") return null;

  const uploadDir = path.join(process.cwd(), "public", "equipment-images");

  await fs.mkdir(uploadDir, { recursive: true });

  const uniqueFilename = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, uniqueFilename);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await fs.writeFile(filePath, buffer);

  return `/equipment-images/${uniqueFilename}`;
}

export async function createEquipmentAction(formData: FormData) {
  const name = formData.get("name") as string;
  const quantity = Number(formData.get("quantity"));
  const pictureFile = formData.get("picture") as File;

  const picturePath = await saveImage(pictureFile);

  console.log("Added Equipment:", { name, quantity, picturePath });
}

export async function updateEquipmentAction(formData: FormData) {
  const id = Number(formData.get("equipmentId"));
  const name = formData.get("name") as string;
  const quantity = Number(formData.get("quantity"));
  const pictureFile = formData.get("picture") as File;
  const existingPicture = formData.get("existingPicture") as string;

  let picturePath: string | null = existingPicture || null;

  if (pictureFile && pictureFile.size > 0) {
    picturePath = await saveImage(pictureFile);
  }

  console.log("Updated Equipment:", { id, name, quantity, picturePath });
}

export async function deleteEquipmentAction(equipmentId: number) {
  try {
    if (!equipmentId) {
      return { success: false, error: "有効な備品IDが指定されていません" };
    }

    console.log("Deleted Equipment ID:", equipmentId);

    return { success: true };
  } catch (error) {
    console.error("削除エラー:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "削除処理に失敗しました",
    };
  }
}
