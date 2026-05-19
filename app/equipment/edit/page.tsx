import { AddEquipmentForm } from "@/components/AddEquipmentForm";
import { getEquipmentById } from "@/db/queries/equipments";

import styles from "../../add-equipment/page.module.css";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function EditEquipmentPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const id = Number(resolvedParams.id);

  if (!Number.isInteger(id) || id <= 0) {
    return <p>Error: Invalid equipment ID.</p>;
  }

  const equipment = await getEquipmentById(id);

  if (!equipment) {
    return <p>Error: Equipment not found.</p>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>備品を修正</h1>
        <AddEquipmentForm
          mode="edit"
          initialValues={{
            id: equipment.id,
            name: equipment.name,
            quantity: equipment.quantity,
            picture: equipment.picture,
          }}
        />
      </div>
    </main>
  );
}
