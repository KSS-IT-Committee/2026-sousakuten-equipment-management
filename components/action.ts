"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { returnBorrowing } from "@/db/queries/borrowings";
import { Borrowings, Equipments } from "@/db/schema";
import { CLASS_CODES, ClassCode } from "@/lib/class-number";
import { db } from "@/lib/db";

export const returnBorrowingAction = async (
  borrowingId: number,
  returnedAt: Date,
) => {
  await returnBorrowing(borrowingId, returnedAt);
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
