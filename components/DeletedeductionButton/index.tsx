"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteDeductionAction } from "@/lib/action";

import styles from "./DeletedeductionButton.module.css";

export default function DeleteDeductionButton({
  deductionId,
}: {
  deductionId: number;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await deleteDeductionAction(deductionId);
      router.back();
    } catch (error) {
      console.error(error);
      alert("削除に失敗しました。");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.triggerArea}>
      <button
        onClick={() => setIsDeleting(true)}
        className={styles.deleteButton}
      >
        この減点を削除
      </button>
      {isDeleting ? (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationBox}>
            <h2>本当にこの減点を削除しますか？</h2>
            <button
              onClick={handleDelete}
              disabled={loading}
              className={styles.confirmButton}
            >
              {loading ? "削除中..." : "削除"}
            </button>
            <button
              onClick={() => setIsDeleting(false)}
              disabled={loading}
              className={styles.cancelButton}
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
