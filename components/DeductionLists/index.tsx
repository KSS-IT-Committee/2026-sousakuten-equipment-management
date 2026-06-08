import { DeductionSum } from "@/components/DeductionSum";
import { CLASSES, type ClassName } from "@/db/schema";

import styles from "./DeductionLists.module.css";
export async function DeductionSumsList() {
  const groupedClasses = CLASSES.reduce(
    (groups, className) => {
      const grade = className[0];
      if (!groups[grade]) {
        groups[grade] = [];
      }
      groups[grade].push(className);
      return groups;
    },
    {} as Record<string, ClassName[]>,
  );
  return (
    <div>
      <h1 className={styles.title}>クラス別減点合計</h1>
      <div className={styles.deductionSumList}>
        {Object.entries(groupedClasses).map(([grade, classes]) => (
          <div key={grade} className={styles.gradeSection}>
            <h2 className={styles.gradeTitle}>{grade}年生</h2>
            <div className={styles.classList}>
              {classes.map((className) => (
                <DeductionSum key={className} className={className} />
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
