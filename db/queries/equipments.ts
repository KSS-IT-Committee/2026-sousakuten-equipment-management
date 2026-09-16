import { and, count, eq, isNull } from "drizzle-orm";

import { Borrowings, Equipments } from "@/db/schema";
import { db, type Executor } from "@/lib/db";
import { recordDbFetch } from "@/lib/db-last-fetched";

/**
 * Every listable equipment plus how many of it are currently out on loan.
 *
 * The list page used to render one <EquipmentCell id=…/> per row and let each
 * cell fetch its own equipment and borrowings, which cost 1+2N round trips for
 * an N-item catalog. Counting the open borrowings in the same grouped join
 * makes it one query regardless of N. The left join is what keeps equipment
 * with zero active borrowings in the result.
 */
export async function getEquipmentsWithBorrowedCounts() {
  const result = await db
    .select({
      id: Equipments.id,
      name: Equipments.name,
      quantity: Equipments.quantity,
      picture: Equipments.picture,
      borrowedCount: count(Borrowings.id),
    })
    .from(Equipments)
    .leftJoin(
      Borrowings,
      and(
        eq(Borrowings.equipmentId, Equipments.id),
        isNull(Borrowings.returnedAt),
      ),
    )
    .where(eq(Equipments.deleted, false))
    .groupBy(Equipments.id)
    .orderBy(Equipments.id);
  recordDbFetch("equipment");
  recordDbFetch("borrowings");
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

// The write helpers below accept an executor so a caller can compose several
// writes into one atomic transaction; they default to the shared `db`.
export async function createEquipment(
  data: {
    name: string;
    quantity: number;
    picture?: string | null;
  },
  executor: Executor = db,
) {
  return await executor.insert(Equipments).values(data);
}

export async function updateEquipment(
  id: number,
  data: {
    name: string;
    quantity: number;
    picture?: string | null;
  },
  executor: Executor = db,
) {
  return await executor
    .update(Equipments)
    .set(data)
    .where(and(eq(Equipments.id, id), eq(Equipments.deleted, false)));
}

export async function deleteEquipmentById(id: number, executor: Executor = db) {
  return await executor
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
