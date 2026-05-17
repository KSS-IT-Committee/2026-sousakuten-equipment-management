import { getDeductionsByClasses } from "@/db/queries/deductions";
import { ClassName } from "@/db/schema";
import styles from "@/styles/deduction.module.css";
import Link from "next/link";

export async function DeductionCellsByClasses({ classes }: { classes: ClassName[] }) {
  const deductions = await getDeductionsByClasses(classes);
  const isthereAnyDeduction = deductions.length > 0;

  return (

    <div className={styles.cells}>
      {!isthereAnyDeduction ? (
        <p>現在、これまでの減点はありません。</p>
      ) : (
        <div className={styles.deductionList}>
          <div className={styles.deductionsample}>
            <h2>クラス</h2>
            <h2>ID</h2>
            <h2>日にち</h2>
            <h2>加点・減点</h2>
            <h2>内容</h2>
          </div>
          <hr className={styles.line} />
          {deductions.map((deduction) => (
            <Link href={`/deduction?id=${deduction.id}`} key={deduction.id} className={styles.linkArea}>
              <div key={deduction.id} className={styles.deduction}>
                <h3>{deduction.className}</h3>
                <p>{deduction.id}</p>
                <p>{deduction.occurredAt.toLocaleDateString("ja-JP")}</p>
                <p>{deduction.points * -1}</p>
                <p>{deduction.content}</p>

              </div>
            </Link>
          ))}
        </div>
      )
      }

    </div>
  )
}