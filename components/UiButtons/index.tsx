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

  const groupedClasses = CLASSES.reduce((groups, className) => {
    const grade = className[0];
    if (!groups[grade]) {
      groups[grade] = [];
    }
    groups[grade].push(className);
    return groups;
  }, {} as Record<string, ClassName[]>);

  const updateParams = (key: string, value: string | null = null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if ((key === "sortBy" || key === "sortOrder") && selected !== "1") {
      params.set("section", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const updateParamsBulk = (
    updates: Record<string, string | null | undefined>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "" || value === undefined) {
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

  const selectAllClasses = () => {
    updateClassFilters([...CLASSES]);
  };

  const toggleClassFilter = (className: ClassName) => {
    const currentClasses = hasClassFilter ? selectedClasses : [];
    const nextClasses = currentClasses.includes(className)
      ? currentClasses.filter((selectedClass) => selectedClass !== className)
      : [...currentClasses, className];

    updateClassFilters(nextClasses);
  };

  return (
    <div className={styles.controls}>
      <div className={styles.changeUIButtons}>
        {selectedClasses.length > 0 ? (
          <button
            onClick={() => updateParamsBulk({ section: "1", class: null })}
            className={styles.notactiveButton}
          >
            戻る
          </button>
        ) : (
          <button
            onClick={() => updateParamsBulk({ class: null, section: "1" })}
            className={
              selected === "1" ? styles.activeButton : styles.notactiveButton
            }
          >
            減点履歴
          </button>
        )}


        <button
          onClick={() => updateParamsBulk({ class: null, section: "2" })}
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

      {selected === "1" && selectedClasses.length === 0 ? (
        <div className={styles.filterPanel}>
          <div className={styles.filterHeader}>
            <span className={styles.filterTitle}>クラスを選択</span>
          </div>
          <button
            type="button"
            className={styles.classCheckboxLabel}
            onClick={selectAllClasses}
          >
            全てのクラス
          </button>
          {Object.entries(groupedClasses).map(([grade, classes]) => (
            <div key={grade} className={styles.classGroup}>
              <div className={styles.classGroupTitle}>{grade}年</div>
              <div className={styles.classCheckboxGrid}>
                {classes.map((className) => (
                  <button
                    key={className}
                    className={styles.classCheckboxLabel}
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
