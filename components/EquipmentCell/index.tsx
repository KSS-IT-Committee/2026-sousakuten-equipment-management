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
    return <div className={styles.errorCell}>備品が見つかりませんでした</div>;
  }

  const borrowedCount = borrowings.length;
  const availableCount = Math.max(0, equipment.quantity - borrowedCount);

  const availabilityPercentage =
    equipment.quantity > 0
      ? Math.round((availableCount / equipment.quantity) * 100)
      : 0;

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

  const isBase64 = imageSrc?.startsWith("data:image/");
  const isPath = imageSrc?.startsWith("/");
  const hasImage =
    imageSrc && (isBase64 || isPath) && imageSrc !== "[object File]";

  return (
    <div className={styles.cell}>
      <Link href={`/equipment?id=${equipment.id}`} className={styles.linkArea}>
        <div className={styles.imageWrapper}>
          {hasImage ? (
            <Image
              src={imageSrc}
              alt={equipment.name}
              width={200}
              height={200}
              priority={id <= 4}
              className={styles.image}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className={styles.imageFallback}>No Image</div>
          )}
        </div>
        <h2 className={styles.title}>{equipment.name}</h2>
      </Link>

      <div className={styles.quantitySection}>
        <div className={styles.quantityInfo}>
          <span className={styles.quantityLabel}>利用可能:</span>
          <span
            className={`${styles.quantityValue} ${
              availableCount === 0
                ? styles.unavailable
                : availableCount <= equipment.quantity * 0.3
                  ? styles.warning
                  : styles.available
            }`}
          >
            {availableCount}/{equipment.quantity}
          </span>
        </div>
        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuenow={availabilityPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`${styles.progressFill} ${progressFillClass}`}
            style={progressStyle}
          ></div>
        </div>
      </div>
    </div>
  );
}
