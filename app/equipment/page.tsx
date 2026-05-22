import Link from "next/link";

import { BorrowingEquipList } from "@/components/BorrowingEquipList";
import { EquipmentCell } from "@/components/Equipment";

import styles from "./base.module.css";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function Equipment({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const id = Number(resolvedParams.id);
  const isValidId = !isNaN(id);

  return (
    <>
      <div className={styles.cell}>
        <div className={styles.actionGroup}>
          <Link href={`/equipment/edit?id=${id}`} className={styles.editButton}>
            修正
          </Link>
        </div>

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
