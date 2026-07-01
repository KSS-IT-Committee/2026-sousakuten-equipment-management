import styles from "@/app/base.module.css";
import { EquipmentCell } from "@/components/EquipmentCell";
import { getEquipments, getGlobalLastUpdatedAt } from "@/db/queries/equipments";

export const dynamic = "force-dynamic";

export default async function Home() {
  const equipments = await getEquipments();
  const updatedDate = await getGlobalLastUpdatedAt();

  return (
    <>
      <div className={styles.pageTitleWrapper}>
        <h1 className={styles.pageTitle}>創作展 貸出備品管理サイト</h1>
      </div>
      <div>
        <p className={styles.updatedAt}>
          最終更新日時:{" "}
          {updatedDate
            ? updatedDate.toLocaleString("ja-JP", {
                timeZone: "Asia/Tokyo",
              })
            : "不明"}
        </p>
      </div>
      <div className={styles.equipmentList}>
        {equipments.map((equipment) => (
          <EquipmentCell key={equipment.id} id={equipment.id} />
        ))}
      </div>
    </>
  );
}
