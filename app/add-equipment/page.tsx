import { redirect } from "next/navigation";

import styles from "@/app/add-equipment/page.module.css";
import { AddEquipmentForm } from "@/components/AddEquipmentForm";
import { checkUserAuth } from "@/lib/auth";

export default async function AddEquipmentPage() {
  const perm = await checkUserAuth();
  if (!perm.isLoggedIn) {
    redirect("/");
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>新しい機器を追加</h1>
      <AddEquipmentForm mode="create" />
    </div>
  );
}
