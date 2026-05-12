"use client";

import { borrowEquipmentAction } from "@/components/action";

export function BorrowButton({
  equipmentId,
  classCode,
  disabled = false,
  onBorrow,
}: {
  equipmentId: number;
  classCode: string;
  disabled?: boolean;
  onBorrow?: () => void;
}) {
  const handleBorrow = async () => {
    if (disabled) {
      return;
    }

    await borrowEquipmentAction(equipmentId, classCode);
    if (onBorrow) {
      onBorrow();
    }
  };
  return (
    <button onClick={handleBorrow} disabled={disabled}>
      Borrow
    </button>
  );
}
