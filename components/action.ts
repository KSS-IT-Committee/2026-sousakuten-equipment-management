"use server";

import { revalidatePath } from "next/cache";

import {
  createBorrowing,
  getActiveBorrowingsByID,
  returnBorrowing,
} from "@/db/queries/borrowings";
import { getEquipmentById } from "@/db/queries/equipments";

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
  const equipment = await getEquipmentById(equipmentId);

  if (!equipment) {
    throw new Error("Equipment not found");
  }

  const activeBorrowings = await getActiveBorrowingsByID(equipmentId);
  const availableCount = equipment.quantity - activeBorrowings.length;

  if (availableCount <= 0) {
    throw new Error("No equipment available to borrow");
  }

  await createBorrowing({
    equipmentId,
    class: classCode,
    borrowedAt: new Date(),
  });
  revalidatePath("/equipment");
  revalidatePath("/");
  revalidatePath("/borrowings");
};
