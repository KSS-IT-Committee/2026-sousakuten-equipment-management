import Link from "next/link";

import { BorrowingEquipList } from "@/components/BorrowingEquipList";
import { BorrowingPopup } from "@/components/BorrowPopup";
import { EquipmentCell } from "@/components/EquipmentCell";
import { Internal } from "@/components/Internal";
import { LoanHistory } from "@/components/LoanHistory";
import { getActiveBorrowingsByEquipmentId } from "@/db/queries/borrowings";
import { getEquipmentById } from "@/db/queries/equipments";

import styles from "./base.module.css";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function Equipment({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const id = Number(resolvedParams.id);
  const isValidId = Number.isInteger(id) && id > 0;

  if (!isValidId) {
    return <p>エラー: 無効なID</p>;
  }

  const equipment = await getEquipmentById(id);
  if (!equipment) {
    return <p>エラー: 備品が見つかりませんでした</p>;
  }

  const borrowings = await getActiveBorrowingsByEquipmentId(id);
  const availableCount = equipment.quantity - borrowings.length;

  return (
    <div className={styles.cell}>
      <Internal role="Sousakuten">
        <div className={styles.actionGroup}>
          <Link href={`/equipment/edit?id=${id}`} className={styles.editButton}>
            編集
          </Link>
          <BorrowingPopup
            id={id}
            title={equipment.name}
            availableCount={availableCount}
          />
        </div>
      </Internal>

      <EquipmentCell id={id} />
      <BorrowingEquipList id={id} />
      <LoanHistory id={id} />
    </div>
  );
}
