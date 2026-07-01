import { and, desc, eq, isNull } from "drizzle-orm";

import { Borrowings, ClassName, Equipments } from "@/db/schema";
import { db } from "@/lib/db";

export async function getBorrowings() {
  return await db.select().from(Borrowings).orderBy(Borrowings.id);
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

export async function getBorrowingsByClass(classCode: ClassName) {
  return await db
    .select()
    .from(Borrowings)
    .where(eq(Borrowings.class, classCode));
}

export async function getActiveBorrowings() {
  return await db
    .select()
    .from(Borrowings)
    .where(isNull(Borrowings.returnedAt))
    .orderBy(desc(Borrowings.borrowedAt));
}

export async function getActiveBorrowingsByEquipmentId(equipmentId: number) {
  return await db
    .select()
    .from(Borrowings)
    .where(
      and(
        eq(Borrowings.equipmentId, equipmentId),
        isNull(Borrowings.returnedAt),
      ),
    )
    .orderBy(desc(Borrowings.borrowedAt));
}

export async function createBorrowing(data: {
  equipmentId: number;
  class: ClassName;
  borrowedAt?: Date;
  returnedAt?: Date;
}) {
  await db
    .update(Equipments)
    .set({ updatedAt: new Date() })
    .where(eq(Equipments.id, data.equipmentId));
  return await db.insert(Borrowings).values(data);
}

export async function returnBorrowing(id: number, returnedAt: Date) {
  const borrowing = await db
    .select({ equipmentId: Borrowings.equipmentId })
    .from(Borrowings)
    .where(eq(Borrowings.id, id))
    .limit(1);

  if (borrowing.length > 0) {
    await db
      .update(Equipments)
      .set({ updatedAt: new Date() })
      .where(eq(Equipments.id, borrowing[0].equipmentId));
  }

  return await db
    .update(Borrowings)
    .set({ returnedAt: returnedAt })
    .where(and(eq(Borrowings.id, id), isNull(Borrowings.returnedAt)));
}
