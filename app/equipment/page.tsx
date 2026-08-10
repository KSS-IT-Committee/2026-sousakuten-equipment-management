import Link from "next/link";
import { Suspense } from "react";

import { BorrowingEquipListById } from "@/components/BorrowingEquipList";
import { BorrowingPopup } from "@/components/BorrowPopup";
import { EquipmentCell } from "@/components/EquipmentCell";
import { Internal } from "@/components/Internal";
import { LoanHistory } from "@/components/LoanHistory";
import { PageLoading } from "@/components/PageLoading";
import { getActiveBorrowingsByEquipmentId } from "@/db/queries/borrowings";
import { getEquipmentById } from "@/db/queries/equipments";

import styles from "./base.module.css";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

// Synchronous shell, so the loading UI streams before the equipment lookup
// resolves. The early returns below are plain JSX, not status interrupts — if one
// ever becomes notFound(), it has to move up into this shell.
export default function Equipment({ searchParams }: Props) {
  return (
    <Suspense fallback={<PageLoading />}>
      <EquipmentContent searchParams={searchParams} />
    </Suspense>
  );
}

async function EquipmentContent({ searchParams }: Props) {
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
      <BorrowingEquipListById id={id} />
      <LoanHistory id={id} />
    </div>
  );
}
