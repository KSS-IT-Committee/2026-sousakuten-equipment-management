import { eq } from "drizzle-orm";

import { Equipments } from "@/db/schema";
import { db } from "@/lib/db";

export async function getEquipments() {
  return await db.select().from(Equipments).orderBy(Equipments.id);
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
  picture?: string;
}) {
  return await db.insert(Equipments).values(data);
}

export async function updateEquipment(
  id: number,
  data: {
    name: string;
    quantity: number;
    picture?: string;
  },
) {
  return await db.update(Equipments).set(data).where(eq(Equipments.id, id));
}

export async function deleteEquipmentById(id: number) {
  return await db.delete(Equipments).where(eq(Equipments.id, id));
}
