import Link from "next/link";

import { getDeductionsByClass } from "@/db/queries/deductions";
import type { ClassName } from "@/db/schema";
import styles from "@/styles/Deductionsum.module.css";
type Props = {
  className: ClassName;
};

export async function DeductionSum({ className }: Props) {
  const deductions = await getDeductionsByClass(className);
  let sum = 0;
  for (const deduction of deductions) {
    sum += deduction.points;
  }
  return (
    <div className={styles.section}>
      <Link href={`/deduction?class=${className}`} className={styles.linkArea}>
        <h2 className={styles.title}>{className}</h2>
        <p className={styles.sum}>{sum}点</p>
      </Link>
    </div>
  );
}
