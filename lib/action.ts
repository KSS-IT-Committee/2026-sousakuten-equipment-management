"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { createDeduction, deleteDeductionById } from "@/db/queries/deductions";
import { Borrowings, ClassName, Equipments } from "@/db/schema";
import { requireAdmin } from "@/lib/authorize";
import { CLASS_CODES, ClassCode } from "@/lib/class-number";
import { db } from "@/lib/db";

export const returnBorrowingAction = async (
  borrowingId: number,
  returnedAt: Date,
) => {
  await requireAdmin();

  await db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(Borrowings)
      .where(and(eq(Borrowings.id, borrowingId), isNull(Borrowings.returnedAt)))
      .for("update");

    if (!existing) {
      throw new Error("Borrowing not found or already returned");
    }

    await tx
      .update(Equipments)
      .set({ updatedAt: new Date() })
      .where(eq(Equipments.id, existing.equipmentId));

    await tx
      .update(Borrowings)
      .set({ returnedAt: returnedAt })
      .where(eq(Borrowings.id, borrowingId));
  });

  revalidatePath("/equipment");
  revalidatePath("/");
  revalidatePath("/borrowings");
};

export const borrowEquipmentAction = async (
  equipmentId: number,
  classCode: ClassName,
) => {
  await requireAdmin();
  if (!Number.isInteger(equipmentId) || equipmentId <= 0) {
    throw new Error("備品IDが不正です");
  }
  if (!CLASS_CODES.includes(classCode as ClassCode)) {
    throw new Error("クラスコードが不正です");
  }

  await db.transaction(async (tx) => {
    const [eqItem] = await tx
      .select()
      .from(Equipments)
      .where(eq(Equipments.id, equipmentId))
      .for("update");

    if (!eqItem) {
      throw new Error("Equipment not found");
    }

    const active = await tx
      .select({ id: Borrowings.id })
      .from(Borrowings)
      .where(
        and(
          eq(Borrowings.equipmentId, equipmentId),
          isNull(Borrowings.returnedAt),
        ),
      );

    if (eqItem.quantity - active.length <= 0) {
      throw new Error("No equipment available to borrow");
    }

    await tx
      .update(Equipments)
      .set({ updatedAt: new Date() })
      .where(eq(Equipments.id, equipmentId));

    await tx.insert(Borrowings).values({
      equipmentId,
      class: classCode,
    });
  });

  revalidatePath("/equipment");
  revalidatePath("/");
  revalidatePath("/borrowings");
};

export const createDeductionAction = async (data: {
  className: string;
  content: string;
  points: number;
}) => {
  await requireAdmin();
  if (!CLASS_CODES.includes(data.className as ClassCode)) {
    throw new Error("クラス名が不正です");
  }
  const content = data.content.trim();

  if (content === "") {
    throw new Error("内容を入力してください");
  }
  if (!Number.isInteger(data.points) || data.points <= 0) {
    throw new Error("点数は1以上の整数で入力してください");
  }
  await createDeduction({
    className: data.className as ClassCode,
    content,
    points: -Math.abs(data.points),
    occurredAt: new Date(),
  });
  revalidatePath("/deductions");
};

export const deleteDeductionAction = async (id: number) => {
  await requireAdmin();
  await deleteDeductionById(id);
  revalidatePath("/deductions");
  revalidatePath("/history");
};
