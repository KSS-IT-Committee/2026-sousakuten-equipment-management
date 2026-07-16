import { Internal } from "@/components/Internal";
import { ReturnButton } from "@/components/ReturnButton";
import { getActiveBorrowingsByEquipmentId } from "@/db/queries/borrowings";
import { getClassLabel } from "@/lib/class-number";

import styles from "./BorrowingEquipList.module.css";

export async function BorrowingEquipList({ id }: { id: number }) {
  const borrowings = await getActiveBorrowingsByEquipmentId(id);
  return (
    <div>
      <div className={styles.summaryWrapper}>
        <h3 className={styles.summaryTitle}>
          現在の借出数:{" "}
          <span className={styles.summaryCount}>{borrowings.length}</span>件
        </h3>
      </div>
      {borrowings.length === 0 ? (
        <p className={styles.emptyMessage}>現在、借出中の備品はありません</p>
      ) : (
        <div role="list">
          {borrowings.map((borrowing) => (
            <div key={borrowing.id} className={styles.listItem} role="listitem">
              <div className={styles.infoGroup}>
                <span className={styles.class}>
                  クラス: {getClassLabel(borrowing.class)}
                </span>
                <span className={styles.date}>
                  貸出日: {new Date(borrowing.borrowedAt).toLocaleDateString()}
                </span>
              </div>

              <Internal role="Sousakuten">
                <div className={styles.actionGroup}>
                  <ReturnButton borrowingId={borrowing.id} />
                </div>
              </Internal>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
