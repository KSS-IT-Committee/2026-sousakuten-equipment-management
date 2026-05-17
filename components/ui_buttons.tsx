"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import styles from "@/styles/deduction_ui.module.css";

export default function SelectButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = searchParams.get("section") ?? "1";

  const setSelected = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.changeUIButtons}>
      <button onClick={() => setSelected("1")} className={selected === "1" ? styles.activeButton : styles.notactiveButton}>
        減点履歴
      </button>

      <button onClick={() => setSelected("2")} className={selected === "2" ? styles.activeButton : styles.notactiveButton}>
        クラス別減点ポイント
      </button>

      <button onClick={() => setSelected("3")} className={selected === "3" ? styles.activeButton : styles.notactiveButton}>
        減点追加
      </button>
    </div>
  );
}
