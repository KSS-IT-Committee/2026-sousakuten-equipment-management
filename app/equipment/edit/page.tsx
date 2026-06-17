import { AddEquipmentForm } from "@/components/AddEquipmentForm";
import { getAvailableImages } from "@/components/AddEquipmentForm/action";
import { AuthGuard } from "@/components/AuthGuard";
import { DeleteEquipmentButton } from "@/components/DeleteEquipmentButton";
import { getEquipmentById } from "@/db/queries/equipments";

import styles from "../../add-equipment/page.module.css";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function EditEquipmentPage({ searchParams }: Props) {
  return (
    <AuthGuard role="Sousakuten">
      <EditEquipmentContent searchParams={searchParams} />
    </AuthGuard>
  );
}

async function EditEquipmentContent({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const id = Number(resolvedParams.id);

  if (!Number.isInteger(id) || id <= 0) {
    return <p>エラー: 無効なID</p>;
  }

  const equipment = await getEquipmentById(id);
  const images = await getAvailableImages();

  if (!equipment) {
    return <p>エラー: 備品が見つかりませんでした</p>;
  }
  return (
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
        availableImages={images}
      />
      <DeleteEquipmentButton
        equipmentId={equipment.id}
        equipmentName={equipment.name}
      />
    </div>
  );
}
