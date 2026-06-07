"use client";

import { useState } from "react";

import { createDeductionAction } from "@/lib/action";

import styles from "./DeductionPopup.module.css";

export default function AddDeductionUI() {
  const [isOpen, setIsOpen] = useState(false);
  const grades = ["1", "2", "3", "4", "5", "6"];
  const classIds = ["A", "B", "C", "D"];
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [content, setContent] = useState("");
  const [points, setPoints] = useState<number>(5);
  const [loading, setLoading] = useState(false);
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
          setLoading(false);
        }}
        className={styles.button}
      >
        減点追加
      </button>
      {isOpen ? (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="deduction-popup-title"
        >
          <div className={styles.popup}>
            <div className={styles.details}>
              <h2 id="deduction-popup-title">減点する</h2>
              <p>ここに入力すると、即時減点されます。</p>
            </div>


            <div className={styles.inputGroup}>
              <div className={styles.inputareas}>
                <div className={styles.inputarea}>
                  <label htmlFor="grade-select" className={styles.label}>
                    学年
                  </label>
                  <select
                    id="grade-select"
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">学年を選択</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}年
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.inputarea}>
                  <label htmlFor="class-select" className={styles.label}>
                    組
                  </label>
                  <select
                    id="class-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">組を選択</option>
                    {classIds.map((classId) => (
                      <option key={classId} value={classId}>
                        {classId}組
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.inputarea}>
                <label htmlFor="class-select" className={styles.label}>
                  減点点数
                </label>
                <input
                  type="number"
                  className={styles.numberselect}
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                />
              </div>

              <textarea
                placeholder="減点の詳細を入力"
                className={styles.textInput}
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
        <div
          className={styles.confirmationOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="deduction-confirmation-title"
        >
          <div className={styles.confirmationPopup}>
            <h2 id="deduction-confirmation-title">確認</h2>
            <p>{`${selectedGrade}年${selectedClass}組に${points}点の減点を追加しますか？`}<br />{"理由:" + content}</p>
            <button
              onClick={async () => {
                if (loading) return;
                setLoading(true);
                try {
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
                } catch (error) {
                  alert(
                    error instanceof Error
                      ? error.message
                      : "減点の追加に失敗しました",
                  );
                } finally {
                  setLoading(false);
                }
              }}
              className={styles.confirmButton}
              disabled={loading}
            >
              {loading ? "処理中..." : "OK"}
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
