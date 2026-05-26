"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

export default function SelectButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = searchParams.get("section") ?? "1";
  const sortBy = (searchParams.get("sortBy") ??
    "occurredAt") as DeductionSortKey;
  const sortOrder = (searchParams.get("sortOrder") ??
    "desc") as DeductionSortOrder;
  const rawSelectedClasses = searchParams.getAll("class");
  const selectedClasses = rawSelectedClasses.filter(
    (className): className is ClassName =>
      CLASSES.includes(className as ClassName),
  );
  const hasClassFilter = selectedClasses.length > 0;

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if ((key === "sortBy" || key === "sortOrder") && selected !== "1") {
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
    const currentClasses = hasClassFilter ? selectedClasses : [...CLASSES];
    const nextClasses = currentClasses.includes(className)
      ? currentClasses.filter((selectedClass) => selectedClass !== className)
      : [...currentClasses, className];

    updateClassFilters(nextClasses);
  };

  return (
    <div className={styles.controls}>
      <div className={styles.changeUIButtons}>
        <button
          onClick={() => updateParams("section", "1")}
          className={
            selected === "1" ? styles.activeButton : styles.notactiveButton
          }
        >
          減点履歴
        </button>

        <button
          onClick={() => updateParams("section", "2")}
          className={
            selected === "2" ? styles.activeButton : styles.notactiveButton
          }
        >
          クラス別減点ポイント
        </button>
      </div>

      <div className={styles.sortControls}>
        <label className={styles.sortLabel}>
          並べ替え項目
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(event) => updateParams("sortBy", event.target.value)}
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
            updateParams("sortOrder", sortOrder === "asc" ? "desc" : "asc")
          }
          className={styles.sortOrderButton}
          type="button"
        >
          {sortOrder === "asc" ? "昇順" : "降順"}
        </button>
      </div>

      {selected === "1" ? (
        <div className={styles.filterPanel}>
          <div className={styles.filterHeader}>
            <span className={styles.filterTitle}>クラスで絞り込み</span>
            <div className={styles.filterActions}>
              <button
                className={styles.filterActionButton}
                onClick={() => updateClassFilters(CLASSES)}
                type="button"
              >
                全クラス表示
              </button>
              <button
                className={styles.filterActionButton}
                onClick={() => updateClassFilters([])}
                type="button"
              >
                すべて解除
              </button>
            </div>
          </div>

          <div className={styles.classCheckboxGrid}>
            {CLASSES.map((className) => {
              const isChecked = hasClassFilter
                ? selectedClasses.includes(className)
                : true;
              return (
                <label
                  key={className}
                  className={styles.classCheckboxLabel}
                  data-checked={isChecked ? "true" : "false"}
                >
                  <input
                    checked={isChecked}
                    className={styles.classCheckbox}
                    onChange={() => toggleClassFilter(className)}
                    type="checkbox"
                  />
                  <span
                    className={styles.classCheckboxMark}
                    aria-hidden="true"
                  />
                  <span className={styles.classCheckboxText}>{className}</span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
