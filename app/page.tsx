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
          {(() => {
            if (!updatedDate || isNaN(new Date(updatedDate).getTime())) {
              return "不明";
            }

            const date = new Date(updatedDate);

            const jstDate = new Date(
              date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
            );
            const pad = (num: number) => String(num).padStart(2, "0");

            const month = pad(jstDate.getMonth() + 1);
            const day = pad(jstDate.getDate());
            const hour = pad(jstDate.getHours());
            const minute = pad(jstDate.getMinutes());

            return `${month}/${day} ${hour}:${minute} (JST)`;
          })()}
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
