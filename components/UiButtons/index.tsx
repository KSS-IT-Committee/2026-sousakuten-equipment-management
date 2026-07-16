"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type {
  DeductionSortKey,
  DeductionSortOrder,
} from "@/components/DeductionUI";
import { CLASSES, type ClassName } from "@/db/schema";

import styles from "./UiButtons.module.css";

const sortOptions: { value: DeductionSortKey; label: string }[] = [
  { value: "occurredAt", label: "日にち" },
  { value: "className", label: "クラス" },
  { value: "id", label: "ID" },
  { value: "points", label: "加点・減点" },
  { value: "content", label: "内容" },
];

const classesByGrade = CLASSES.reduce<Record<string, ClassName[]>>(
  (groups, className) => {
    (groups[className[0]] ??= []).push(className);
    return groups;
  },
  {},
);

const getSelectedClassesLabel = (classes: ClassName[]) =>
  classes.length === CLASSES.length ? "全てのクラス" : classes.join(", ");

export default function SelectButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = searchParams.get("section") ?? "1";
  const sortBy = (searchParams.get("sortBy") ??
    "occurredAt") as DeductionSortKey;
  const sortOrder = (searchParams.get("sortOrder") ??
    "desc") as DeductionSortOrder;
  const selectedClasses = searchParams
    .getAll("class")
    .filter((className): className is ClassName =>
      CLASSES.includes(className as ClassName),
    );
  const hasClassFilter = selectedClasses.length > 0;
  const currentClassesLabel = getSelectedClassesLabel(selectedClasses);
  const [displayedClassesLabel, setDisplayedClassesLabel] =
    useState(currentClassesLabel);

  useEffect(() => {
    if (!currentClassesLabel) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setDisplayedClassesLabel(currentClassesLabel);
    });

    return () => window.clearTimeout(timeout);
  }, [currentClassesLabel]);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    if (
      (updates.sortBy !== undefined || updates.sortOrder !== undefined) &&
      selected !== "1"
    ) {
      params.set("section", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const updateClassFilters = (classes: ClassName[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("class");
    if (classes.length > 0) {
      classes.forEach((className) => {
        params.append("class", className);
      });
    }
    if (selected !== "1") {
      params.set("section", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleClassFilter = (className: ClassName) => {
    const nextClasses = selectedClasses.includes(className)
      ? selectedClasses.filter((selectedClass) => selectedClass !== className)
      : [...selectedClasses, className];

    updateClassFilters(nextClasses);
  };

  return (
    <div className={styles.controls}>
      <div className={styles.changeUIButtons}>
        {selectedClasses.length > 0 ? (
          <button
            onClick={() => updateParams({ section: "1", class: null })}
            className={styles.notactiveButton}
          >
            戻る
          </button>
        ) : (
          <button
            onClick={() => updateParams({ class: null, section: "1" })}
            className={
              selected === "1" ? styles.activeButton : styles.notactiveButton
            }
          >
            減点履歴
          </button>
        )}

        <button
          onClick={() => updateParams({ class: null, section: "2" })}
          className={
            selected === "2" ? styles.activeButton : styles.notactiveButton
          }
        >
          クラス別減点ポイント
        </button>
      </div>
      <p
        className={styles.selectedClasses}
        data-visible={hasClassFilter}
        aria-hidden={!hasClassFilter}
      >
        {displayedClassesLabel}
      </p>

      <div className={styles.sortControls}>
        <label className={styles.sortLabel}>
          並べ替え項目
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(event) => updateParams({ sortBy: event.target.value })}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() =>
            updateParams({
              sortOrder: sortOrder === "asc" ? "desc" : "asc",
            })
          }
          className={styles.sortOrderButton}
          type="button"
        >
          {sortOrder === "asc" ? "昇順" : "降順"}
        </button>
      </div>

      {selected === "1" && selectedClasses.length === 0 ? (
        <div className={styles.filterPanel}>
          <div className={styles.filterHeader}>
            <span className={styles.filterTitle}>クラスを選択</span>
          </div>
          <button
            type="button"
            className={styles.classCheckboxLabel}
            data-checked={!hasClassFilter ? "true" : "false"}
            onClick={() => updateClassFilters([...CLASSES])}
          >
            全てのクラス
          </button>
          {Object.entries(classesByGrade).map(([grade, classes]) => (
            <div key={grade} className={styles.classGroup}>
              <div className={styles.classGroupTitle}>{grade}年</div>
              <div className={styles.classCheckboxGrid}>
                {classes.map((className) => (
                  <button
                    key={className}
                    className={styles.classCheckboxLabel}
                    data-checked={
                      selectedClasses.includes(className) ? "true" : "false"
                    }
                    onClick={() => toggleClassFilter(className)}
                  >
                    {className}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
