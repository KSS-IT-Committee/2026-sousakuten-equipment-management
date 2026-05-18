"use client";

import { useState } from "react";

import { BorrowButton } from "@/components/BorrowButton";
import { ClassBox } from "@/components/ClassBox";
import { getClassLabel } from "@/lib/class-number";

import styles from "./BorrowPopup.module.css";

export function BorrowingPopup({
  id,
  title,
  availableCount,
}: {
  id: number;
  title: string;
  availableCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{
    code: string;
    label: string;
  } | null>(null);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const closePopup = () => {
    setIsOpen(false);
    setSelectedClass(null);
  };

  const handleClassSelect = (classCode: string) => {
    setSelectedClass({ code: classCode, label: getClassLabel(classCode) });
  };

  return (
    <div>
      <button
        onClick={togglePopup}
        className={styles.popupButton + " " + styles.primaryButton}
      >
        Open Popup
      </button>
      {isOpen && (
        <div
          className={styles.popupOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) closePopup();
          }}
        >
          <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
              <h2 className={styles.popupTitle}>{title}</h2>
              <button className={styles.closeButton} onClick={closePopup}>
                ✕
              </button>
            </div>
            <div className={styles.popupBody}>
              <ClassBox onSelect={handleClassSelect} />

              {/* Display selected values */}
              {/* Implement the borrowing form here */}
            </div>
            <div className={styles.popupFooter}>
              <button onClick={closePopup} className={styles.popupButton}>
                Cancel
              </button>
              {selectedClass && (
                <BorrowButton
                  equipmentId={id}
                  classCode={selectedClass.code}
                  disabled={availableCount <= 0}
                  onBorrow={closePopup}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
