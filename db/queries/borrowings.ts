import { and, desc, eq, isNull } from "drizzle-orm";

import { Borrowings, ClassName } from "@/db/schema";
import { db } from "@/lib/db";
import { recordDbFetch } from "@/lib/db-last-fetched";

export async function getBorrowings() {
  const result = await db.select().from(Borrowings).orderBy(Borrowings.id);
  recordDbFetch("borrowings");
  return result;
}

export async function getBorrowingById(id: number) {
  const result = await db
    .select()
    .from(Borrowings)
    .where(eq(Borrowings.id, id));
  recordDbFetch("borrowings");
  return result[0];
}

export async function getBorrowingsByEquipmentId(equipmentId: number) {
  const result = await db
    .select()
    .from(Borrowings)
    .where(eq(Borrowings.equipmentId, equipmentId));
  recordDbFetch("borrowings");
  return result;
}

export async function getBorrowingsByClass(classCode: ClassName) {
  const result = await db
    .select()
    .from(Borrowings)
    .where(eq(Borrowings.class, classCode));
  recordDbFetch("borrowings");
  return result;
}

export async function getActiveBorrowings() {
  const result = await db
    .select()
    .from(Borrowings)
    .where(isNull(Borrowings.returnedAt))
    .orderBy(desc(Borrowings.borrowedAt));
  recordDbFetch("borrowings");
  return result;
}

export async function getActiveBorrowingsByEquipmentId(equipmentId: number) {
  const result = await db
    .select()
    .from(Borrowings)
    .where(
      and(
        eq(Borrowings.equipmentId, equipmentId),
        isNull(Borrowings.returnedAt),
      ),
    )
    .orderBy(desc(Borrowings.borrowedAt));
  recordDbFetch("borrowings");
  return result;
}

export async function createBorrowing(data: {
  equipmentId: number;
  class: ClassName;
  borrowedAt?: Date;
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
