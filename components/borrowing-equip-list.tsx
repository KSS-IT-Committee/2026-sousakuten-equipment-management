import { ReturnButton } from "@/components/ReturnButton";
import { getActiveBorrowingsByID } from "@/db/queries/borrowings";
import { getClassLabel } from "@/lib/class-number";
import styles from "@/styles/borrowing-equip-list.module.css";

export async function BorrowingEquipList({ id }: { id: number }) {
  const borrowings = await getActiveBorrowingsByID(id);
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            margin: "0 0 16px 0",
            fontSize: "18px",
            fontWeight: "600",
            color: "#1a1a1a",
          }}
        >
          現在の借出数:{" "}
          <span style={{ color: "#007bff" }}>{borrowings.length}</span>件
        </h3>
      </div>
      {borrowings.length === 0 ? (
        <p style={{ color: "#666", fontStyle: "italic" }}>
          現在、借出中の備品はありません
        </p>
      ) : (
        borrowings.map((borrowing) => (
          <div key={borrowing.id} className={styles.listItem}>
            <div className={styles.infoGroup}>
              <span className={styles.class}>
                クラス: {getClassLabel(borrowing.class)}
              </span>
              <span className={styles.date}>
                貸出日: {borrowing.borrowedAt.toLocaleDateString()}
              </span>
            </div>

            <div className={styles.actionGroup}>
              <ReturnButton borrowingId={borrowing.id} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
