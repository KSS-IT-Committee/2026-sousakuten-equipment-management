import { Suspense } from "react";

import styles from "@/app/base.module.css";
import { BorrowingEquipListByClass } from "@/components/BorrowingEquipList";
import { DbFetchStatus } from "@/components/DbFetchStatus";
import { EquipmentCell } from "@/components/EquipmentCell";
import { PageLoading } from "@/components/PageLoading";
import { getEquipments } from "@/db/queries/equipments";
import { getViewer } from "@/lib/authorize";
import { isClassCode } from "@/lib/class-number";

export const dynamic = "force-dynamic";

// The page itself is synchronous, so it becomes the static shell and the
// loading UI streams immediately; the DB-backed body renders behind the
// boundary. Nothing here interrupts with a status code — keep it that way, or
// move the interrupt up into this shell.
export default function Home() {
  return (
    <Suspense fallback={<PageLoading />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const [equipments, viewer] = await Promise.all([
    getEquipments(),
    getViewer(),
  ]);
  // Staff, committee and logged-out visitors have no class of their own; they
  // still get the full equipment catalog, just without the per-class list.
  const ownClass =
    viewer && isClassCode(viewer.className) ? viewer.className : null;

  return (
    <>
      <div className={styles.pageTitleWrapper}>
        <h1 className={styles.pageTitle}>創作展 貸出備品・減点管理サイト</h1>
      </div>

      {ownClass !== null && (
        <div className={styles.borrowingListWrapper}>
          <h2 className={styles.borrowingListTitle}>現在の借出状況</h2>
          <BorrowingEquipListByClass classCode={ownClass} />
        </div>
      )}

      <DbFetchStatus />

      {equipments.length === 0 && (
        <div className={styles.noEquipment}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22v-9" />
            <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" />
            <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" />
            <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z" />
          </svg>
          <p className={styles.noDataMessage}>
            表示できる備品はありません。
            <br />
            右下のメニューから他の項目にアクセスできます。
          </p>
        </div>
      )}

      <div className={styles.equipmentList}>
        {equipments.map((equipment) => (
          <EquipmentCell key={equipment.id} id={equipment.id} />
        ))}
      </div>
    </>
  );
}
