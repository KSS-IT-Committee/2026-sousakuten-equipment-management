"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { DeductionSortKey, DeductionSortOrder } from "@/components/deduction_ui";
import styles from "@/styles/deduction_ui.module.css";

const sortOptions: { value: DeductionSortKey; label: string }[] = [
  { value: "className", label: "クラス" },
  { value: "id", label: "ID" },
  { value: "points", label: "加点・減点" },
];

export default function SelectButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = searchParams.get("section") ?? "1";
  const sortBy = (searchParams.get("sortBy") ?? "occurredAt") as DeductionSortKey;
  const sortOrder = (searchParams.get("sortOrder") ?? "desc") as DeductionSortOrder;

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if ((key === "sortBy" || key === "sortOrder") && selected !== "1") {
      params.set("section", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.controls}>
      <div className={styles.changeUIButtons}>
        <button onClick={() => updateParams("section", "1")} className={selected === "1" ? styles.activeButton : styles.notactiveButton}>
          減点履歴
        </button>

        <button onClick={() => updateParams("section", "2")} className={selected === "2" ? styles.activeButton : styles.notactiveButton}>
          クラス別減点ポイント
        </button>

        <button onClick={() => updateParams("section", "3")} className={selected === "3" ? styles.activeButton : styles.notactiveButton}>
          減点追加
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
          onClick={() => updateParams("sortOrder", sortOrder === "asc" ? "desc" : "asc")}
          className={styles.sortOrderButton}
          type="button"
        >
          {sortOrder === "asc" ? "昇順" : "降順"}
        </button>
      </div>
    </div>
  );
}
