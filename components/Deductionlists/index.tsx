import { DeductionSum } from "@/components/Deductionsum";
import { CLASSES } from "@/db/schema";

import styles from "./DeductionLists.module.css";
export async function DeductionSumsList() {
  return (
    <div>
      <h1 className={styles.title}>クラス別減点合計</h1>
      <div className={styles.deductionSumList}>
        {CLASSES.map((className) => (
          <DeductionSum key={className} className={className} />
        ))}
      </div>
    </div>
  );
}
