import Link from "next/link";

import { BorrowingEquipList } from "@/components/BorrowingEquipList";
import { BorrowingPopup } from "@/components/BorrowPopup";
import { EquipmentCell } from "@/components/Equipment";
import { getActiveBorrowingsByID } from "@/db/queries/borrowings";
import { getEquipmentById } from "@/db/queries/equipments";

import styles from "./base.module.css";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function Equipment({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const id = Number(resolvedParams.id);
  const isValidId = !isNaN(id);

  if (!isValidId) {
    return <p>Error: Invalid equipment ID.</p>;
  }

  const equipment = await getEquipmentById(id);
  if (!equipment) {
    return <p>Error: Equipment not found.</p>;
  }

  const borrowings = await getActiveBorrowingsByID(id);
  const availableCount = equipment.quantity - borrowings.length;

  return (
    <>
      <div className={styles.cell}>
        <div className={styles.actionGroup}>
          <Link href={`/equipment/edit?id=${id}`} className={styles.editButton}>
            修正
          </Link>
          <BorrowingPopup
            id={id}
            title={equipment.name}
            availableCount={availableCount}
          />
        </div>

        <EquipmentCell id={id} />
        <BorrowingEquipList id={id} />
      </div>
    </>
  );
}
