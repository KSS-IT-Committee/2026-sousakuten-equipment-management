"use server";

import { revalidatePath } from "next/cache";

import { createBorrowing, returnBorrowing } from "@/db/queries/borrowings";

export async function returnBorrowingAction(
  borrowingId: number,
  returnDate: Date,
) {
  await returnBorrowing(borrowingId, returnDate);
  revalidatePath("/borrowings");
  revalidatePath("/equipment");
  revalidatePath("/");
}

export async function borrowEquipmentAction(
  equipmentId: number,
  classNumber: number,
) {
  await createBorrowing({
    equipmentId,
    class: classNumber,
    borrowDate: new Date(),
  });
  revalidatePath("/equipment");
  revalidatePath("/");
  revalidatePath("/borrowings");
}
