import styles from "@/app/add-equipment/page.module.css";
import { AddEquipmentForm } from "@/components/AddEquipmentForm";
import { getAvailableImages } from "@/components/AddEquipmentForm/action";
import { AuthGuard } from "@/components/AuthGuard";

export default function AddEquipmentPage() {
  return (
    <AuthGuard role="Sousakuten">
      <AddEquipmentContent />
    </AuthGuard>
  );
}

async function AddEquipmentContent() {
  const images = await getAvailableImages();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>新しい機器を追加</h1>
      <AddEquipmentForm mode="create" availableImages={images} />
    </div>
  );
}
