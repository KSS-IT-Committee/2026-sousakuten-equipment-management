import { Equipments } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm/sql";

export async function getEquipments() {
  return await db
    .select({ id: Equipments.id })
    .from(Equipments)
    .orderBy(Equipments.id);
}

export async function getEquipmentById(id: number) {
  const result = await db
    .select()
    .from(Equipments)
    .where(eq(Equipments.id, id))
    .orderBy(Equipments.id);
  return result[0];
}

export async function createEquipment(data: {
  name: string;
  quantity: number;
  picture?: string | null;
}) {
  return await db.insert(Equipments).values(data);
}

export async function updateEquipment(
  id: number,
  data: {
    name: string;
    quantity: number;
    picture?: string | null;
  },
) {
  return await db.update(Equipments).set(data).where(eq(Equipments.id, id));
}

export async function deleteEquipmentById(id: number) {
  return await db.delete(Equipments).where(eq(Equipments.id, id));
}

export const getGlobalLastUpdatedAt = async () => {
  const result = await db
    .select({
      lastUpdate: sql<Date | null>`max(${Equipments.updatedAt})`,
    })
    .from(Equipments);

  return result[0]?.lastUpdate ?? null;
};
