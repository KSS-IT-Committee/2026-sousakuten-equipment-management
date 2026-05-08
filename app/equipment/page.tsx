import BorrowingEquipList from "@/components/borrowing-equip-list";
import EquipmentCell from "@/components/equipment";

import styles from "./base.module.css";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function Equipment({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const rawId = resolvedParams.id;

  const id = rawId ? Number(rawId) : undefined;

  return (
    <>
      <div className={styles.cell}>
        {id && !isNaN(id) ? (
          <EquipmentCell id={id} />
        ) : (
          <p>Error: Invalid equipment ID.</p>
        )}
        {id && !isNaN(id) && <BorrowingEquipList id={id} />}
      </div>
    </>
  );
}
