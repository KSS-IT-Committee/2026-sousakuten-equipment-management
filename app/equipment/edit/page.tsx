import { Suspense } from "react";

import { AddEquipmentForm } from "@/components/AddEquipmentForm";
import { AuthGuard } from "@/components/AuthGuard";
import { DeleteEquipmentButton } from "@/components/DeleteEquipmentButton";
import { PageLoading } from "@/components/PageLoading";
import { getEquipmentById } from "@/db/queries/equipments";

import styles from "../../add-equipment/page.module.css";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

// AuthGuard stays in the static shell so its 401/403 is still a real status
// code; the equipment lookup streams behind the boundary below it.
export default function EditEquipmentPage({ searchParams }: Props) {
  return (
    <AuthGuard role="Sousakuten">
      <Suspense fallback={<PageLoading />}>
        <EditEquipmentContent searchParams={searchParams} />
      </Suspense>
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
      />
      <DeleteEquipmentButton
        equipmentId={equipment.id}
        equipmentName={equipment.name}
      />
    </div>
  );
}
