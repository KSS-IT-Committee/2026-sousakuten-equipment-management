"use client";

import { useState } from "react";

import { CLASS_CODES, ClassCode } from "@/lib/class-number";

import styles from "./ClassBox.module.css";

interface ClassBoxProps {
  onSelect?: (classCode: ClassCode) => void;
}

export function ClassBox({ onSelect }: ClassBoxProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const grades = ["1", "2", "3", "4", "5", "6"];
  const classIds = ["A", "B", "C", "D"];

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGrade(e.target.value);
    setSelectedClassId("");
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClassId = e.target.value;
    setSelectedClassId(newClassId);

    if (onSelect && selectedGrade && newClassId) {
      const code = `${selectedGrade}${newClassId}` as ClassCode;
      if (CLASS_CODES.includes(code)) {
        onSelect(code);
      }
    }
  };

  return (
    <div className={styles.classBoxContainer}>
      <div className={styles.gradeContainer}>
        <label htmlFor="grade-select" className={styles.label}>
          学年:
        </label>
        <select
          id="grade-select"
          value={selectedGrade}
          onChange={handleGradeChange}
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

      <div className={styles.classContainer}>
        <label htmlFor="class-select" className={styles.label}>
          組:
        </label>
        <select
          id="class-select"
          value={selectedClassId}
          onChange={handleClassChange}
          disabled={!selectedGrade}
          className={styles.select}
        >
          <option value="">組を選択</option>
          {classIds.map((id) => (
            <option key={id} value={id}>
              {id}組
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
