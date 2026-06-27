// components/DeleteEquipmentButton/index.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// import  deleteEquipmentAction
import { deleteEquipmentAction } from "@/components/AddEquipmentForm/action";

import styles from "./DeleteEquipmentButton.module.css";

type DeleteEquipmentButtonProps = {
  equipmentId: number;
  equipmentName: string;
};

export function DeleteEquipmentButton({
  equipmentId,
  equipmentName,
}: DeleteEquipmentButtonProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizedEquipmentName = equipmentName.trim();
  const canDelete = confirmText.trim() === normalizedEquipmentName;

  const openConfirm = () => {
    setError("");
    setConfirmText("");
    setIsConfirming(true);
  };

  const closeConfirm = () => {
    if (loading) {
      return;
    }

    setIsConfirming(false);
    setConfirmText("");
    setError("");
  };

  const handleDelete = async () => {
    if (!canDelete || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await deleteEquipmentAction(equipmentId);
      if (!result.success) {
        setError(result.error || "削除に失敗しました");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.triggerArea}>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={openConfirm}
        >
          備品を削除
        </button>
      </div>

      {isConfirming ? (
        <div
          className={styles.confirmationOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-equipment-title"
        >
          <div className={styles.confirmationBox}>
            <h2 id="delete-equipment-title" className={styles.title}>
              本当にこの備品を削除しますか？
            </h2>
            <p className={styles.description}>
              削除対象: <strong>{equipmentName}</strong>
            </p>
            <p className={styles.warning}>
              なお、貸出履歴がある備品は削除できません。
            </p>
            <label htmlFor="confirm-equipment-name" className={styles.label}>
              備品名を入力して削除を確定してください
            </label>
            <input
              id="confirm-equipment-name"
              type="text"
              className={styles.input}
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder={equipmentName}
              autoComplete="off"
            />
            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.confirmButton}
                onClick={handleDelete}
                disabled={!canDelete || loading}
              >
                {loading ? "削除中..." : "削除する"}
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={closeConfirm}
                disabled={loading}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
