import styles from "@/app/add-equipment/page.module.css";
import { AddEquipmentForm } from "@/components/AddEquipmentForm";
import { AuthGuard } from "@/components/AuthGuard";

export default function AddEquipmentPage() {
  return (
    <AuthGuard role="Sousakuten">
      <AddEquipmentContent />
    </AuthGuard>
  );
}

function AddEquipmentContent() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>新しい機器を追加</h1>
      <AddEquipmentForm mode="create" />
    </div>
  );
}
