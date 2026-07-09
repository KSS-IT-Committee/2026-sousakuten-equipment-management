// action.ts
"use server";

import { and, eq, isNull } from "drizzle-orm";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import path from "path";

import { getActiveBorrowingsByEquipmentId } from "@/db/queries/borrowings";
import {
  countEquipmentsByPicture,
  createEquipment,
  getEquipmentById,
  updateEquipment,
} from "@/db/queries/equipments";
import { Borrowings, Equipments } from "@/db/schema";
import { isAdmin, requireAdmin } from "@/lib/authorize";
import { db } from "@/lib/db";
import {
  ALLOWED_IMAGE_LABEL,
  detectImageType,
  equipmentImagesDir,
  IMAGE_URL_PREFIX,
} from "@/lib/equipment-images";

async function saveImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0 || file.name === "undefined") return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate by content (magic bytes), not by extension, so a disguised payload
  // such as an SVG/HTML file can never be stored and later served same-origin.
  const detected = detectImageType(buffer);
  if (!detected) {
    throw new Error(
      `error: unsupported image type (${ALLOWED_IMAGE_LABEL} only)`,
    );
  }

  const dir = equipmentImagesDir();
  await fs.mkdir(dir, { recursive: true });

  // Keep a sanitized stem from the original name for readability, but force the
  // canonical extension from the detected type so the on-disk name always
  // reflects real content; the timestamp keeps names unique. basename() strips
  // any path components so the upload can never escape the images directory.
  const sanitized = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, "_");
  const stem = sanitized.replace(/\.[^.]+$/, "") || "image";
  const uniqueFilename = `${Date.now()}-${stem}${detected.ext}`;
  const filePath = path.join(dir, uniqueFilename);

  await fs.writeFile(filePath, buffer);

  return `${IMAGE_URL_PREFIX}${uniqueFilename}`;
}

/**
 * Delete an uploaded image file from disk, but only when it is one of ours and
 * no equipment row references it anymore. This is what makes image cleanup safe:
 * a path still shared by another equipment is left untouched, so we never delete
 * an image out from under a record that is still using it.
 */
async function deleteImageIfUnreferenced(
  picturePath: string | null,
): Promise<void> {
  // Only manage files we host under /equipment-images/. Leave base64 data URIs,
  // external URLs, or any other value alone.
  if (!picturePath || !picturePath.startsWith(IMAGE_URL_PREFIX)) return;

  // Still referenced elsewhere? Keep the file.
  const refCount = await countEquipmentsByPicture(picturePath);
  if (refCount > 0) return;

  const dir = path.resolve(equipmentImagesDir());
  // basename() drops any directory parts, so the result can only ever resolve
  // to a file directly inside the images directory — no traversal possible.
  const filePath = path.resolve(dir, path.basename(picturePath));
  if (path.dirname(filePath) !== dir) return;

  try {
    await fs.unlink(filePath);
  } catch (err) {
    // An already-missing file is fine; surface anything else without failing
    // the request the user just completed.
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("画像ファイルの削除に失敗しました:", err);
    }
  }
}

export async function createEquipmentAction(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const quantity = Number(formData.get("quantity"));
  const pictureFile = formData.get("picture") as File | null;

  if (!name) {
    throw new Error("error: equipment name is required");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("error: quantity must be a positive integer");
  }

  const picture = await saveImage(pictureFile);

  const result = await createEquipment({ name, quantity, picture });

  revalidatePath("/equipment");
  revalidatePath("/");
  return result;
}

export async function updateEquipmentAction(formData: FormData) {
  await requireAdmin();

  const equipmentId = Number(formData.get("equipmentId"));
  const name = String(formData.get("name") ?? "").trim();
  const quantity = Number(formData.get("quantity"));
  const pictureFile = formData.get("picture") as File | null;
  const existingPicture = String(formData.get("existingPicture") ?? "");

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

  // The picture stored before this edit, used to decide on file cleanup.
  const oldPicture = existingEquipment.picture;

  // Resolve the new picture: a freshly uploaded file wins; otherwise keep what
  // the form carried back (the existing path, or "" when the user removed it).
  let newPicture: string | null;
  if (pictureFile && pictureFile.size > 0) {
    newPicture = await saveImage(pictureFile);
  } else {
    newPicture = existingPicture.length > 0 ? existingPicture : null;
  }

  const result = await updateEquipment(equipmentId, {
    name,
    quantity,
    picture: newPicture,
  });

  // Only clean up when the picture actually changed (replaced or cleared). When
  // the image is left untouched, oldPicture === newPicture and nothing is
  // deleted — this is the fix for the image disappearing on an unrelated edit.
  if (oldPicture && oldPicture !== newPicture) {
    await deleteImageIfUnreferenced(oldPicture);
  }

  revalidatePath("/equipment");
  revalidatePath("/");
  return result;
}

export async function deleteEquipmentAction(
  equipmentId: number,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdmin())) {
    return { success: false, error: "この操作には創作展委員の権限が必要です" };
  }
  if (!Number.isInteger(equipmentId) || equipmentId <= 0) {
    return { success: false, error: "備品IDが不正です" };
  }

  let deletedPicture: string | null = null;

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

      const activeBorrowings = await tx
        .select({ id: Borrowings.id })
        .from(Borrowings)
        .where(
          and(
            eq(Borrowings.equipmentId, equipmentId),
            isNull(Borrowings.returnedAt),
          ),
        );
      if (activeBorrowings.length > 0) {
        throw new Error("貸出中の備品は削除できません");
      }

      deletedPicture = existingEquipment.picture;

      await tx
        .delete(Borrowings)
        .where(eq(Borrowings.equipmentId, equipmentId));

      await tx.delete(Equipments).where(eq(Equipments.id, equipmentId));
    });

    // Remove the image only after the row is gone, so the reference check sees
    // the post-delete state.
    await deleteImageIfUnreferenced(deletedPicture);

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
