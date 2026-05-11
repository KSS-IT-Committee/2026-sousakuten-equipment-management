"use server";

import { revalidatePath } from "next/cache";

import { createEquipment } from "@/db/queries/equipments";

export async function createEquipmentAction(data: {
  name: string;
  quantity: number;
  picture?: string;
}) {
  const result = await createEquipment(data);
  revalidatePath("/equipment");
  revalidatePath("/");
  return result;
}
