"use client";

import { useState } from "react";

import { borrowEquipmentAction } from "@/lib/action";

export function BorrowButton({
  equipmentId,
  classCode,
  disabled = false,
  onBorrow,
  className,
}: {
  equipmentId: number;
  classCode: string;
  disabled?: boolean;
  onBorrow?: () => void;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleBorrow = async () => {
    if (disabled || loading) {
      return;
    }

    setLoading(true);

    try {
      await borrowEquipmentAction(equipmentId, classCode);
      if (onBorrow) {
        onBorrow();
      }
    } catch (error) {
      console.error(error);
      alert("貸出処理に失敗しました。コンソールを確認してください。");
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      className={className}
      onClick={handleBorrow}
      disabled={disabled || loading}
    >
      {loading ? "処理中..." : "貸出する"}
    </button>
  );
}
