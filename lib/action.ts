"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { createDeduction, deleteDeductionById } from "@/db/queries/deductions";
import { Borrowings, Equipments } from "@/db/schema";
import { CLASS_CODES, ClassCode } from "@/lib/class-number";
import { db } from "@/lib/db";

export const returnBorrowingAction = async (
  borrowingId: number,
  returnedAt: Date,
) => {
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
      .update(Borrowings)
      .set({ returnedAt })
      .where(eq(Borrowings.id, borrowingId));
  });

  revalidatePath("/borrowings");
  revalidatePath("/equipment");
  revalidatePath("/");
};

export const borrowEquipmentAction = async (
  equipmentId: number,
  classCode: string,
) => {
  if (!CLASS_CODES.includes(classCode as ClassCode)) {
    throw new Error("Invalid class code");
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

    await tx.insert(Borrowings).values({
      equipmentId,
      class: classCode,
      borrowedAt: new Date(),
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
  if (!CLASS_CODES.includes(data.className as ClassCode)) {
    throw new Error("Invalid class name");
  }
  if (data.content.trim() === "") throw new Error("Invalid content");
  if (!Number.isInteger(data.points) || data.points <= 0) {
    throw new Error("Invalid points");
  }
  await createDeduction({
    className: data.className as ClassCode,
    content: data.content,
    points: data.points,
    occurredAt: new Date(),
  });
  revalidatePath("/deductions");
  revalidatePath("/classdeduction");
};

export const deleteDeductionAction = async (id: number) => {
  await deleteDeductionById(id);
  revalidatePath("/deductions");
  revalidatePath("/classdeduction");
};
