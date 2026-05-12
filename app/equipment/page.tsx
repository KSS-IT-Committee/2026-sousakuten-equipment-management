import { BorrowingEquipList } from "@/components/borrowing-equip-list";
import { EquipmentCell } from "@/components/equipment";

import styles from "./base.module.css";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function Equipment({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const id = Number(resolvedParams.id);
  const isValidId = isNaN(id);

  return (
    <>
      <div className={styles.cell}>
        {isValidId ? (
          <>
            <EquipmentCell id={id} />
            <BorrowingEquipList id={id} />
          </>
        ) : (
          <p>Error: Invalid equipment ID.</p>
        )}
      </div>
    </>
  );
}
