import { and, count, eq } from "drizzle-orm";

import { Equipments } from "@/db/schema";
import { db } from "@/lib/db";
import { recordDbFetch } from "@/lib/db-last-fetched";

export async function getEquipments() {
  const result = await db
    .select({ id: Equipments.id })
    .from(Equipments)
    .where(eq(Equipments.deleted, false))
    .orderBy(Equipments.id);
  recordDbFetch("equipment");
  return result;
}

export async function getEquipmentById(id: number) {
  const result = await db
    .select()
    .from(Equipments)
    .where(and(eq(Equipments.id, id), eq(Equipments.deleted, false)))
    .orderBy(Equipments.id);
  recordDbFetch("equipment");
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
  return await db
    .update(Equipments)
    .set(data)
    .where(and(eq(Equipments.id, id), eq(Equipments.deleted, false)));
}

export async function deleteEquipmentById(id: number) {
  return await db
    .update(Equipments)
    .set({ deleted: true })
    .where(and(eq(Equipments.id, id), eq(Equipments.deleted, false)));
}

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
