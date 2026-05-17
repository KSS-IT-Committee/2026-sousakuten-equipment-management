import { ClassName, Deductions } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";

export async function getDeductions() {
  return await db.select().from(Deductions);
}

export async function createDeduction(data: {
  className: ClassName;
  content: string;
  points: number;
  occurredAt?: Date;
}) {
  return await db.insert(Deductions).values(data);
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

export async function deleteDeduction(id: number) {
  await db.delete(Deductions).where(eq(Deductions.id, id));
}
