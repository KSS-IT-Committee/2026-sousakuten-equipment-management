import Link from "next/link";

import type {
  DeductionSortKey,
  DeductionSortOrder,
} from "@/components/DeductionUI";
import { getDeductionsByClasses } from "@/db/queries/deductions";
import type { ClassName } from "@/db/schema";

import styles from "./ClassDeduction.module.css";

const sortDeductionMap: Record<
  DeductionSortKey,
  (
    left: Awaited<ReturnType<typeof getDeductionsByClasses>>[number],
    right: Awaited<ReturnType<typeof getDeductionsByClasses>>[number],
  ) => number
> = {
  className: (left, right) =>
    left.className.localeCompare(right.className, "ja"),
  id: (left, right) => left.id - right.id,
  occurredAt: (left, right) =>
    left.occurredAt.getTime() - right.occurredAt.getTime(),
  points: (left, right) => left.points - right.points,
  content: (left, right) => left.content.localeCompare(right.content, "ja"),
};

export async function DeductionCellsByClasses({
  classes,
  sortBy,
  sortOrder,
}: {
  classes: ClassName[];
  sortBy: DeductionSortKey;
  sortOrder: DeductionSortOrder;
}) {
  if (classes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyStateTitle}>
          表示するクラスが選択されていません。
        </p>
        <p className={styles.emptyStateBody}>
          チェックボックスから1つ以上のクラスを選ぶと、減点履歴が表示されます。
        </p>
      </div>
    );
  }

  const deductions = await getDeductionsByClasses(classes);
  const sortedDeductions = [...deductions].sort((left, right) => {
    const result = sortDeductionMap[sortBy](left, right);
    if (result !== 0) {
      return sortOrder === "asc" ? result : result * -1;
    }

    if (sortBy !== "id") {
      return right.id - left.id;
    }

    return 0;
  });
  const isthereAnyDeduction = deductions.length > 0;

  return (
    <div className={styles.cells}>
      {!isthereAnyDeduction ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>
            選択したクラスの減点履歴はまだありません。
          </p>
          <p className={styles.emptyStateBody}>
            クラスの絞り込みを変えるか、新しく減点を追加するとここに表示されます。
          </p>
        </div>
      ) : (
        <div className={styles.deductionList}>
          <div className={styles.deductionsample}>
            <h2>クラス</h2>
            <h2>ID</h2>
            <h2>日にち</h2>
            <h2>加点・減点</h2>
            <h2 className={styles.contentHeader}>内容</h2>
          </div>
          <hr className={styles.line} />
          {sortedDeductions.map((deduction) => (
            <Link
              href={`/history?id=${deduction.id}`}
              key={deduction.id}
              className={styles.linkArea}
            >
              <div className={styles.deduction}>
                <h3>{deduction.className}</h3>
                <p>ID: {deduction.id}</p>
                <p>{deduction.occurredAt.toLocaleDateString("ja-JP")}</p>
                <p>{deduction.points}</p>
                <p className={styles.content}>{deduction.content}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
