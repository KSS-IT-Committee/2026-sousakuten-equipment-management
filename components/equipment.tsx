import Image from "next/image";
import Link from "next/link";

import { BorrowingPopup } from "@/components/borrow_popup";
import { getActiveBorrowingsByID } from "@/db/queries/borrowings";
import { getEquipmentById } from "@/db/queries/equipments";
import styles from "@/styles/equipment.module.css";

export async function EquipmentCell({ id }: { id: number }) {
  const equipment = await getEquipmentById(id);
  const borrowings = await getActiveBorrowingsByID(id);

  if (!equipment) {
    return <div>Equipment not found</div>;
  }

  const borrowedCount = borrowings.length;
  const availableCount = equipment.quantity - borrowedCount;
  const availabilityPercentage = Math.round(
    (availableCount / equipment.quantity) * 100,
  );

  // Determine progress bar color based on availability percentage
  let progressColor = "#ff9800"; // orange (default)
  if (availabilityPercentage >= 70) {
    progressColor = "#28a745"; // green
  } else if (availabilityPercentage <= 30) {
    progressColor = "#ff9800"; // orange
  }

  return (
    <div className={styles.cell}>
      <Link href={`/equipment?id=${id}`} className={styles.linkArea}>
        {equipment.picture && (
          <Image
            src={equipment.picture}
            alt={equipment.name}
            width={100}
            height={100}
          />
        )}
        <h2>{equipment.name}</h2>
      </Link>

      <div className={styles.quantitySection}>
        <div className={styles.quantityInfo}>
          <span className={styles.quantityLabel}>利用可能:</span>
          <span
            className={`${styles.quantityValue} ${availableCount === 0 ? styles.unavailable : availableCount <= equipment.quantity * 0.3 ? styles.warning : styles.available}`}
          >
            {availableCount}/{equipment.quantity}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${availabilityPercentage}%`,
              backgroundColor: progressColor,
            }}
          ></div>
        </div>
      </div>

      <BorrowingPopup
        id={id}
        title={equipment.name}
        availableCount={availableCount}
      />
    </div>
  );
}
