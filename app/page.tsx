import styles from "@/app/base.module.css";
import { DefaultFooter } from "@/app/components/footer";
import { EquipmentCell } from "@/components/equipment";
import { getEquipments } from "@/db/queries/equipments";
export const dynamic = "force-dynamic";
export default async function Home() {
  const equipments = await getEquipments();
  return (
    <main className="flex-1 flex flex-col items-center justify-start">
      <div style={{ width: "100%", marginBottom: "24px" }}>
        <h1 className="text-4xl font-bold text-center">
          創作展 貸出備品管理サイト
        </h1>
      </div>
      <div className={styles.equipmentList}>
        {equipments.map((equipment, i) => (
          <EquipmentCell key={i} id={equipment.id} />
        ))}
      </div>
      <DefaultFooter />
    </main>
  );
}
