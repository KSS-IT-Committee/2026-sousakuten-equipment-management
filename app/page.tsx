import styles from "@/app/base.module.css";
import { DbFetchStatus } from "@/components/DbFetchStatus";
import { EquipmentCell } from "@/components/EquipmentCell";
import { getEquipments } from "@/db/queries/equipments";

export const dynamic = "force-dynamic";

export default async function Home() {
  const equipments = await getEquipments();

  return (
    <>
      <div className={styles.pageTitleWrapper}>
        <h1 className={styles.pageTitle}>創作展 貸出備品管理サイト</h1>
      </div>
      <DbFetchStatus />
      <div className={styles.equipmentList}>
        {equipments.map((equipment) => (
          <EquipmentCell key={equipment.id} id={equipment.id} />
        ))}
      </div>
    </>
  );
}
