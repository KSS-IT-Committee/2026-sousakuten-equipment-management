// action.ts
"use server";

import { and, eq, type InferSelectModel,isNull } from "drizzle-orm";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import path from "path";

import {
  countEquipmentsByPicture,
  createEquipment,
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

type Equipment = InferSelectModel<typeof Equipments>;

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

type UpdateEquipmentResult = Awaited<ReturnType<typeof updateEquipment>>;
type CreateEquipmentResult = Awaited<ReturnType<typeof createEquipment>>;

export async function createEquipmentAction(
  formData: FormData,
): Promise<
  | { success: true; data: CreateEquipmentResult }
  | { success: false; error: string }
> {
  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const quantity = Number(formData.get("quantity"));
    const pictureFile = formData.get("picture") as File | null;

    if (!name) {
      throw new Error("備品名は必須です");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("数量は1以上の整数で入力してください");
    }

    const picture = await saveImage(pictureFile);
    const result = await createEquipment({ name, quantity, picture });

    revalidatePath("/equipment");
    revalidatePath("/");
    return { success: true, data: result };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "登録中にエラーが発生しました",
    };
  }
}

export async function updateEquipmentAction(
  formData: FormData,
): Promise<
  { success: true; data: Equipment } | { success: false; error: string }
> {
  let newPicture: string | null = null;
  let isNewImageSaved = false;

  try {
    await requireAdmin();

    const equipmentId = Number(formData.get("equipmentId"));
    const name = String(formData.get("name") ?? "").trim();
    const quantity = Number(formData.get("quantity"));
    const pictureFile = formData.get("picture") as File | null;
    const isImageDeleted = formData.get("isImageDeleted") === "true";

    if (!Number.isInteger(equipmentId) || equipmentId <= 0) {
      throw new Error("備品IDが不正です");
    }

    if (!name) {
      throw new Error("備品名は必須です");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("数量は1以上の整数で入力してください");
    }

    if (pictureFile && pictureFile.size > 0) {
      newPicture = await saveImage(pictureFile);
      isNewImageSaved = true;
    }

    const result = await db.transaction(async (tx) => {
      const [existingEquipment] = await tx
        .select()
        .from(Equipments)
        .where(
          and(eq(Equipments.id, equipmentId), eq(Equipments.deleted, false)),
        )
        .for("update");

      if (!existingEquipment) {
        throw new Error("対象の備品が見つかりませんでした");
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

      if (quantity < activeBorrowings.length) {
        throw new Error(
          `現在貸出中の数 (${activeBorrowings.length}件) を下回る数量には変更できません`,
        );
      }

      const oldPicture = existingEquipment.picture;

      let finalPicture = oldPicture;
      if (isNewImageSaved) {
        finalPicture = newPicture;
      } else if (isImageDeleted) {
        finalPicture = null;
      }

      const [updatedEquipment] = await tx
        .update(Equipments)
        .set({
          name,
          quantity,
          picture: finalPicture,
        })
        .where(eq(Equipments.id, equipmentId))
        .returning({
          id: Equipments.id,
          name: Equipments.name,
          quantity: Equipments.quantity,
          picture: Equipments.picture,
          deleted: Equipments.deleted,
        });

      return { updatedEquipment, oldPicture, finalPicture };
    });

    if (result.oldPicture && result.oldPicture !== result.finalPicture) {
      await deleteImageIfUnreferenced(result.oldPicture);
    }

    revalidatePath("/equipment");
    revalidatePath("/");
    return { success: true, data: result.updatedEquipment };
  } catch (err) {
    if (isNewImageSaved && newPicture) {
      try {
        await deleteImageIfUnreferenced(newPicture);
      } catch (cleanupErr) {
        console.error(
          "ロールバック時の新規ファイルクリーンアップに失敗しました:",
          cleanupErr,
        );
      }
    }

    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "備品の更新中に予期せぬエラーが発生しました",
    };
  }
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

  try {
    await db.transaction(async (tx) => {
      const [existingEquipment] = await tx
        .select()
        .from(Equipments)
        .where(
          and(eq(Equipments.id, equipmentId), eq(Equipments.deleted, false)),
        )
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

      await tx
        .update(Equipments)
        .set({ deleted: true })
        .where(eq(Equipments.id, equipmentId));
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
