import { count, eq } from "drizzle-orm";
import { sql } from "drizzle-orm/sql";

import { Equipments } from "@/db/schema";
import { db } from "@/lib/db";

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
  return await db.insert(Equipments).values({
    ...data,
    updatedAt: new Date(),
  });
}

export async function updateEquipment(
  id: number,
  data: {
    name: string;
    quantity: number;
    picture?: string | null;
  },
) {
  return await db
    .update(Equipments)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(Equipments.id, id));
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
// How many equipment rows still point at this picture path. Used to decide
// whether an uploaded image file can be removed from disk, so a path shared by
// more than one equipment is never deleted out from under the others.
export async function countEquipmentsByPicture(picture: string) {
  const result = await db
    .select({ value: count() })
    .from(Equipments)
    .where(eq(Equipments.picture, picture));
  return result[0]?.value ?? 0;
}
