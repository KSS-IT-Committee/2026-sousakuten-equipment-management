"use client";

import { useState } from "react";

import { createDeductionAction } from "@/lib/action";
import styles from "@/styles/DeductionPopup.module.css";

export default function AddDeductionUI() {
  const [isOpen, setIsOpen] = useState(false);
  const grades = ["1", "2", "3", "4", "5", "6"];
  const classIds = ["A", "B", "C", "D"];
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [content, setContent] = useState("");
  const [points, setPoints] = useState<number>(5);
  const addDeduction = async (
    className: string,
    content: string,
    points: number,
  ) => {
    await createDeductionAction({
      className: className,
      content: content,
      points: points,
    });
  };
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);
  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(true);
          setSelectedClass("");
          setSelectedGrade("");
          setContent("");
        }}
        className={styles.button}
      >
        減点追加
      </button>
      {isOpen ? (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h2>減点する</h2>
            <p>ここに入力すると、即時減点されます。</p>

            <div className={styles.inputGroup}>
              <label htmlFor="grade-select" className={styles.label}>
                Grade:
              </label>
              <select
                id="grade-select"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className={styles.select}
              >
                <option value="">Select a grade</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}年
                  </option>
                ))}
              </select>
              <label htmlFor="class-select" className={styles.label}>
                Class:
              </label>
              <select
                id="class-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className={styles.select}
              >
                <option value="">Select a class</option>
                {classIds.map((classId) => (
                  <option key={classId} value={classId}>
                    {classId}組
                  </option>
                ))}
              </select>
              <textarea
                placeholder="減点の詳細を入力"
                className={styles.textInput}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <input
                type="number"
                className={styles.select}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
              />
            </div>
            <button
              onClick={async () => {
                setIsOpenConfirmation(true);
              }}
              className={styles.addButton}
              disabled={
                selectedGrade === "" ||
                selectedClass === "" ||
                content.trim() === "" ||
                points <= 0
              }
            >
              減点を追加
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
            >
              閉じる
            </button>
          </div>
        </div>
      ) : null}
      {isOpenConfirmation ? (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationPopup}>
            <h2>確認</h2>
            <p>{`${selectedGrade}年${selectedClass}組に${points}点の減点を追加しますか？`}</p>
            <button
              onClick={async () => {
                await addDeduction(
                  selectedGrade + selectedClass,
                  content,
                  points,
                );
                setIsOpen(false);
                setIsOpenConfirmation(false);
                setSelectedClass("");
                setSelectedGrade("");
                setContent("");
                setPoints(5);
              }}
              className={styles.confirmButton}
            >
              OK
            </button>
            <button
              onClick={() => {
                setIsOpenConfirmation(false);
              }}
              className={styles.cancelButton}
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
