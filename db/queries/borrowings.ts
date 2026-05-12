import { and, eq, isNull } from "drizzle-orm";

import { Borrowings } from "@/db/schema";
import { db } from "@/lib/db";

export async function getBorrowings() {
  return await db.select().from(Borrowings);
}

export async function getBorrowingById(id: number) {
  const result = await db
    .select()
    .from(Borrowings)
    .where(eq(Borrowings.id, id));
  return result[0];
}

export async function getBorrowingsByEquipmentId(equipmentId: number) {
  return await db
    .select()
    .from(Borrowings)
    .where(eq(Borrowings.equipmentId, equipmentId));
}

export async function getBorrowingsByClass(classCode: string) {
  return await db
    .select()
    .from(Borrowings)
    .where(eq(Borrowings.class, classCode));
}

export async function getActiveBorrowings() {
  return await db
    .select()
    .from(Borrowings)
    .where(isNull(Borrowings.returnedAt));
}

export async function getActiveBorrowingsByID(equipmentId: number) {
  return await db
    .select()
    .from(Borrowings)
    .where(
      and(
        eq(Borrowings.equipmentId, equipmentId),
        isNull(Borrowings.returnedAt),
      ),
    );
}

export async function createBorrowing(data: {
  equipmentId: number;
  class: string;
  borrowedAt: Date;
  returnedAt?: Date;
}) {
  return await db.insert(Borrowings).values(data);
}

export async function returnBorrowing(id: number, returnedAt: Date) {
  return await db
    .update(Borrowings)
    .set({ returnedAt: returnedAt })
    .where(and(eq(Borrowings.id, id), isNull(Borrowings.returnedAt)));
}
