"use client";

import { useState } from "react";

import BorrowButton from "@/components/borrow_button";

import styles from "./borrow_popup.module.css";
import ClassBox from "./class_box";

export default function BorrowingPopup({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{
    grade: number;
    classId: number;
    classInfo: string;
  } | null>(null);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleClassSelect = (
    grade: number,
    classId: number,
    classInfo: string,
  ) => {
    setSelectedClass({ grade, classId, classInfo });
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
                  classNumber={selectedClass.grade * 10 + selectedClass.classId}
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
