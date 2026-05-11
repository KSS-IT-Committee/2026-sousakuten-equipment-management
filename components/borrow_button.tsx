"use client";

import { borrowEquipmentAction } from "@/components/action";

export function BorrowButton({
  equipmentId,
  classCode,
  onBorrow,
}: {
  equipmentId: number;
  classCode: string;
  onBorrow?: () => void;
}) {
  const handleBorrow = async () => {
    await borrowEquipmentAction(equipmentId, classCode);
    if (onBorrow) {
      onBorrow();
    }
  };
  return <button onClick={handleBorrow}>Borrow</button>;
}
