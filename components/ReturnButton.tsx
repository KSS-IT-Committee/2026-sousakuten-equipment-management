"use client";

import { returnBorrowingAction } from "@/components/action";
import styles from "@/styles/ReturnButton.module.css";

export function ReturnButton({ borrowingId }: { borrowingId: number }) {
  const handleReturn = async () => {
    try {
      console.log(`Processing return for: ${borrowingId}`);
      await returnBorrowingAction(borrowingId, new Date());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button className={styles.button} onClick={handleReturn}>
      返却
    </button>
  );
}
