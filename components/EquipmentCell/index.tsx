import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { getActiveBorrowingsByEquipmentId } from "@/db/queries/borrowings";
import { getEquipmentById } from "@/db/queries/equipments";

import styles from "./EquipmentCell.module.css";

export async function EquipmentCell({ id }: { id: number }) {
  const equipment = await getEquipmentById(id);
  const borrowings = await getActiveBorrowingsByEquipmentId(id);

  if (!equipment) {
    return <div>備品が見つかりませんでした</div>;
  }

  const borrowedCount = borrowings.length;
  const availableCount = equipment.quantity - borrowedCount;
  const availabilityPercentage = Math.round(
    (availableCount / equipment.quantity) * 100,
  );
  const imageSrc = equipment.picture;
  const progressStyle = {
    "--progress-width": `${availabilityPercentage}%`,
  } as CSSProperties;

  const progressFillClass =
    availabilityPercentage >= 70
      ? styles.progressFillAvailable
      : availabilityPercentage <= 30
        ? styles.progressFillWarning
        : styles.progressFillUnavailable;

  return (
    <div className={styles.cell}>
      <Link href={`/equipment?id=${equipment.id}`} className={styles.linkArea}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={equipment.name}
            width={100}
            height={100}
            className={styles.image}
          />
        ) : (
          <div className={styles.imageFallback}>No Image</div>
        )}
        <h2>{equipment.name}</h2>
      </Link>

      <div className={styles.quantitySection}>
        <div className={styles.quantityInfo}>
          {availableCount <= 0 ? (
            <span className={styles.quantityLabel}>
              現在この備品は利用できません。
            </span>
          ) : (
            <span className={styles.quantityLabel}>利用可能:</span>
          )}

          <span
            className={`${styles.quantityValue} ${availableCount <= 0 ? styles.unavailable : availableCount <= equipment.quantity * 0.3 ? styles.warning : styles.available}`}
          >
            {availableCount}/{equipment.quantity}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${progressFillClass}`}
            style={progressStyle}
          ></div>
        </div>
      </div>
    </div>
  );
}
