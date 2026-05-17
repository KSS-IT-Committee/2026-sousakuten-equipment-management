"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteDeductionAction } from "@/components/action";
import styles from "@/styles/deletededuction_button.module.css";

export default function DeleteDeductionButton({ deductionId }: { deductionId: number }) {
  const handleDelete = async () => {
    await deleteDeductionAction(deductionId);
  };
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  return (
    <div>
      <button onClick={() => setIsDeleting(true)} className={styles.deleteButton}>
        この減点を削除
      </button>
      {isDeleting ? (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationBox}>
            <h2>本当にこの減点を削除しますか？</h2>
            <button onClick={() => {
              handleDelete();
              router.back();
            }} className={styles.confirmButton}>
              削除
            </button>
            <button onClick={() => setIsDeleting(false)} className={styles.cancelButton}>
              キャンセル
            </button>
          </div>
        </div>
      ) : null}
    </div>


  );
}
