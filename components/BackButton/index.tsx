"use client";

import { useRouter } from "next/navigation";

import styles from "./BackButton.module.css";

export default function BackButton() {
  const router = useRouter();

  return (
    <div className={styles.triggerArea}>
      <button onClick={() => router.back()} className={styles.backButton}>
        戻る
      </button>
    </div>
  );
}
