"use client";

import { borrowEquipmentAction } from "@/components/action";

export default function BorrowButton({
  equipmentId,
  classNumber,
  onBorrow,
}: {
  equipmentId: number;
  classNumber: number;
  onBorrow?: () => void;
}) {
  const handleBorrow = async () => {
    await borrowEquipmentAction(equipmentId, classNumber);
    // alert("Borrowed successfully!");
    if (onBorrow) {
      onBorrow();
    }
  };
  return <button onClick={handleBorrow}>Borrow</button>;
}
