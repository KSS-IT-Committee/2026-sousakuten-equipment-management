"use server";

import { revalidatePath } from "next/cache";

import {
  createBorrowing,
  getActiveBorrowingsByID,
  returnBorrowing,
} from "@/db/queries/borrowings";
import { createDeduction, deleteDeductionById } from "@/db/queries/deductions";
import { getEquipmentById } from "@/db/queries/equipments";
import { CLASS_CODES, ClassCode } from "@/lib/class-number";

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
  if (!CLASS_CODES.includes(classCode as ClassCode)) {
    throw new Error("Invalid class code");
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

export const createDeductionAction = async (data: {
  className: string;
  content: string;
  points: number;
}) => {
  if (!CLASS_CODES.includes(data.className as ClassCode)) {
    throw new Error("Invalid class name");
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
