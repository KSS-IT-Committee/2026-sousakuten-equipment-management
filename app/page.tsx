import styles from "@/app/base.module.css";
import { AuthGuard } from "@/components/AuthGuard";
import { EquipmentCell } from "@/components/EquipmentCell";
import { FloatingMenu } from "@/components/FloatingMenu";
import { getEquipments } from "@/db/queries/equipments";

export const dynamic = "force-dynamic";

export default async function Home() {
  const equipments = await getEquipments();

  return (
    <>
      <div className={styles.pageTitleWrapper}>
        <h1 className={styles.pageTitle}>創作展 貸出備品管理サイト</h1>
      </div>
      <div className={styles.equipmentList}>
        {equipments.map((equipment) => (
          <EquipmentCell key={equipment.id} id={equipment.id} />
        ))}
      </div>
      <FloatingMenu items={[
        { label: "減点管理", href: "/deductions" },
        {label:"機能・修正のリクエスト", href:"/requests"},
      ]} />
      <AuthGuard role="Sousakuten">
        <FloatingMenu
          items={[
            { label: "備品を追加", href: "/add-equipment" },
            { label: "減点管理", href: "/deductions" },
            {label:"機能・修正のリクエスト", href:"/requests"},
          ]}
        />
      </AuthGuard>
    </>
  );
}
