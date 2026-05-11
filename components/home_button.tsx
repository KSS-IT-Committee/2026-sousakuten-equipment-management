"use client";

import Link from "next/link";

import styles from "@/styles/home_button.module.css";

export function HomeButton() {
  return (
    <Link href="/" className={styles.homeButton}>
      ← ホームに戻る
    </Link>
  );
}
