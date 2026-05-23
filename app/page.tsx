import styles from "@/app/base.module.css";
import { EquipmentCell } from "@/components/EquipmentCell";
import { DefaultFooter } from "@/components/Footer";
import { getEquipments } from "@/db/queries/equipments";
export const dynamic = "force-dynamic";
export default async function Home() {
  console.log("hi");
  const equipments = await getEquipments();

  return (
    <main className="flex-1 flex flex-col items-center justify-start">
      <div className={styles.pageTitleWrapper}>
        <h1 className={styles.pageTitle}>創作展 貸出備品管理サイト</h1>
      </div>
      <div className={styles.equipmentList}>
        {equipments.map((equipment) => (
          <EquipmentCell key={equipment.id} id={equipment.id} />
        ))}
      </div>
      <DefaultFooter />
    </main>
  );
}
