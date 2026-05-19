import styles from "@/app/add-equipment/page.module.css";
import { AddEquipmentForm } from "@/components/AddEquipmentForm";

export default function AddEquipmentPage() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>新しい機器を追加</h1>
          <AddEquipmentForm />
        </div>
      </main>
    </>
  );
}
