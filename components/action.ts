"use server";

import { createBorrowing, returnBorrowing } from "@/db/queries/borrowings";
import { revalidatePath } from "next/cache";

export async function returnBorrowingAction(
  borrowingId: number,
  returnDate: Date,
) {
  await returnBorrowing(borrowingId, returnDate);
  revalidatePath("/borrowings");
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
}
