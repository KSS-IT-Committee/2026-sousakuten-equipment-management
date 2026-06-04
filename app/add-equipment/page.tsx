import styles from "@/app/add-equipment/page.module.css";
import { AddEquipmentForm } from "@/components/AddEquipmentForm";
import { getAvailableImages } from "@/components/AddEquipmentForm/action";

import { checkUserAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AddEquipmentPage() {
  const images = await getAvailableImages();
  const perm = await checkUserAuth();
  if (!perm.isLoggedIn) {
    redirect("/");
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>新しい機器を追加</h1>
      <AddEquipmentForm mode="create" availableImages={images} />
    </div>
  );
}
