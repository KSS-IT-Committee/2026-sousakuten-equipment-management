"use client";

import { useState } from "react";

import { returnBorrowingAction } from "@/lib/action";
import styles from "@/styles/ReturnButton.module.css";

export function ReturnButton({ borrowingId }: { borrowingId: number }) {
  const [loading, setLoading] = useState(false);

  const handleReturn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await returnBorrowingAction(borrowingId, new Date());
    } catch (error) {
      console.error(error);
      // Simple user feedback; replace with toasts if available
      alert("返却処理に失敗しました。コンソールを確認してください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={styles.button}
      onClick={handleReturn}
      disabled={loading}
      aria-label="返却ボタン"
    >
      {loading ? "処理中..." : "返却"}
    </button>
  );
}
