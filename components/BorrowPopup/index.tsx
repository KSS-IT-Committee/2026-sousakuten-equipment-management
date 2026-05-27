"use client";

import { useState } from "react";

import { BorrowButton } from "@/components/BorrowButton";
import { ClassBox } from "@/components/ClassBox";
import { ClassName } from "@/db/schema";
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
    code: ClassName;
    label: string;
  } | null>(null);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const closePopup = () => {
    setIsOpen(false);
    setSelectedClass(null);
  };

  const handleClassSelect = (classCode: ClassName | null) => {
    if (classCode) {
      setSelectedClass({ code: classCode, label: getClassLabel(classCode) });
    } else {
      setSelectedClass(null);
    }
  };

  const canBorrow = availableCount > 0 && selectedClass !== null;

  return (
    <div className={styles.triggerArea}>
      <button
        onClick={togglePopup}
        className={styles.popupButton + " " + styles.primaryButton}
      >
        貸出
      </button>
      {isOpen && (
        <div
          className={styles.popupOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="borrow-popup-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePopup();
          }}
        >
          <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
              <h2 id="borrow-popup-title" className={styles.popupTitle}>
                {title}
              </h2>
              <p className={styles.popupSubtitle}>
                借りたいクラスを選んでから確定してください
              </p>
              <button
                className={styles.closeButton}
                onClick={closePopup}
                aria-label="閉じる"
              >
                ✕
              </button>
            </div>
            <div className={styles.popupBody}>
              <div className={styles.classBoxWrapper}>
                <ClassBox onSelect={handleClassSelect} />
              </div>

              <div className={styles.summaryBox}>
                <p className={styles.summaryLabel}>選択中のクラス</p>
                <p className={styles.summaryValue}>
                  {selectedClass ? selectedClass.label : "未選択"}
                </p>
                <p className={styles.summaryLabel}>利用可能数</p>
                <p className={styles.summaryValue}>{availableCount} 件</p>
              </div>

              {availableCount <= 0 ? (
                <p className={styles.notice}>現在この備品は貸出できません。</p>
              ) : null}
            </div>
            <div className={styles.popupFooter}>
              <button
                onClick={closePopup}
                className={styles.popupButton + " " + styles.secondaryButton}
              >
                閉じる
              </button>
              {selectedClass && (
                <BorrowButton
                  equipmentId={id}
                  classCode={selectedClass.code}
                  disabled={!canBorrow}
                  onBorrow={closePopup}
                  className={`${styles.borrowButton} ${styles.popupButton} ${styles.primaryButton}`}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
