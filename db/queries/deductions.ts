import { eq, inArray } from "drizzle-orm";

import { ClassName, Deductions } from "@/db/schema";
import { db, type Executor } from "@/lib/db";

export async function getDeductions() {
  return await db.select().from(Deductions);
}

// Accepts an executor so a caller can compose this write with others in one
// transaction; defaults to the shared `db` for standalone use.
export async function createDeduction(
  data: {
    className: ClassName;
    content: string;
    points: number;
    occurredAt?: Date;
  },
  executor: Executor = db,
) {
  return await executor.insert(Deductions).values(data);
}

export async function getDeductionsById(id: number) {
  const result = await db
    .select()
    .from(Deductions)
    .where(eq(Deductions.id, id));
  return result[0];
}

export async function getDeductionsByClass(className: ClassName) {
  return await db
    .select()
    .from(Deductions)
    .where(eq(Deductions.className, className));
}

export async function getDeductionsByClasses(classNames: ClassName[]) {
  return await db
    .select()
    .from(Deductions)
    .where(inArray(Deductions.className, classNames));
}

export async function deleteDeductionById(id: number, executor: Executor = db) {
  await executor.delete(Deductions).where(eq(Deductions.id, id));
}
