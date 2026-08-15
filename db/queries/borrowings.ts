import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";

import { Borrowings, ClassName, Equipments } from "@/db/schema";
import { db, type Executor } from "@/lib/db";
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

export async function getActiveBorrowingsByClass(classCode: ClassName) {
  return await db
    .select({
      id: Borrowings.id,
      class: Borrowings.class,
      borrowedAt: Borrowings.borrowedAt,
      equipmentName: Equipments.name,
    })
    .from(Borrowings)
    .innerJoin(Equipments, eq(Borrowings.equipmentId, Equipments.id))
    .where(and(eq(Borrowings.class, classCode), isNull(Borrowings.returnedAt)));
}

export async function getInActiveBorrowingsByEquipmentId(equipmentId: number) {
  return await db
    .select()
    .from(Borrowings)
    .where(
      and(
        eq(Borrowings.equipmentId, equipmentId),
        isNotNull(Borrowings.returnedAt),
      ),
    )
    .orderBy(desc(Borrowings.borrowedAt));
}

// The write helpers below accept an executor so a caller can compose several
// writes into one atomic transaction; they default to the shared `db`.
export async function createBorrowing(
  data: {
    equipmentId: number;
    class: ClassName;
    borrowedAt?: Date;
    returnedAt?: Date;
    equipmentIdentifier?: number;
  },
  executor: Executor = db,
) {
  return await executor.insert(Borrowings).values(data);
}

export async function returnBorrowing(
  id: number,
  returnedAt: Date,
  executor: Executor = db,
) {
  return await executor
    .update(Borrowings)
    .set({ returnedAt: returnedAt })
    .where(and(eq(Borrowings.id, id), isNull(Borrowings.returnedAt)));
}
