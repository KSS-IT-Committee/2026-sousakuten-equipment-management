"use client";

import classData from "@/assets/class.json";
import { useState } from "react";
import styles from "./class_box.module.css";

interface ClassBoxProps {
  onSelect?: (grade: number, classId: number, classInfo: any) => void;
}

export default function ClassBox({ onSelect }: ClassBoxProps) {
  const [selectedGrade, setSelectedGrade] = useState<number | "">(0);
  const [selectedClassId, setSelectedClassId] = useState<number | "">(0);

  // Get unique grades from class data
  const grades = [...new Set(classData.class.map((cls) => cls.grade))].sort(
    (a, b) => a - b
  );

  // Get class IDs for selected grade
  const classesForGrade = selectedGrade
    ? classData.class
      .filter((cls) => cls.grade === selectedGrade)
      .map((cls) => cls.id)
    : [];

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGrade(e.target.value ? Number(e.target.value) : "");
    setSelectedClassId(""); // Reset class selection when grade changes
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClassId = e.target.value ? Number(e.target.value) : "";
    setSelectedClassId(newClassId);

    if (onSelect && selectedGrade && newClassId) {
      const classInfo = classData.class.find(
        (cls) => cls.grade === selectedGrade && cls.id === newClassId
      );
      if (classInfo) {
        onSelect(selectedGrade as number, newClassId, classInfo);
      }
    }
  };

  // Get the selected class full information
  const selectedClassInfo = classData.class.find(
    (cls) => cls.grade === selectedGrade && cls.id === selectedClassId
  );

  return (
    <div className={styles.classBoxContainer}>
      <div className={styles.gradeContainer}>
        <label htmlFor="grade-select" className={styles.label}>
          Grade:
        </label>
        <select
          id="grade-select"
          value={selectedGrade}
          onChange={handleGradeChange}
          className={styles.select}
        >
          <option value="">Select a grade</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}年
            </option>
          ))}
        </select>
      </div>

      <div className={styles.classContainer}>
        <label htmlFor="class-select" className={styles.label}>
          Class:
        </label>
        <select
          id="class-select"
          value={selectedClassId}
          onChange={handleClassChange}
          disabled={!selectedGrade}
          className={styles.select}
        >
          <option value="">Select a class</option>
          {classesForGrade.map((id) => (
            <option key={id} value={id}>
              {String.fromCharCode(64 + id)}組
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
