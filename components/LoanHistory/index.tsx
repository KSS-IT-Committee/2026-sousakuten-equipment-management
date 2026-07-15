import { getInActiveBorrowingsByEquipmentId } from "@/db/queries/borrowings";
import { getClassLabel } from "@/lib/class-number";

import styles from "./LoanHistory.module.css";

export async function LoanHistory({ id }: { id: number }) {
  const borrows = await getInActiveBorrowingsByEquipmentId(id);

  return (
    <div>
      <h3 className={styles.title}>貸出履歴</h3>
      {borrows.length === 0 ? (
        <p className={styles.emptyMessage}>履歴はありません</p>
      ) : (
        <div role="list">
          {borrows.map((borrow) => (
            <div key={borrow.id} className={styles.listItem} role="listitem">
              <div className={styles.infoGroup}>
                <span className={styles.class}>
                  クラス: {getClassLabel(borrow.class)}
                </span>
                <span className={styles.date}>
                  貸出日: {new Date(borrow.borrowedAt).toLocaleDateString()}
                </span>
                <span className={styles.date}>
                  返却日:{" "}
                  {borrow.returnedAt
                    ? new Date(borrow.returnedAt).toLocaleDateString()
                    : "未返却"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
