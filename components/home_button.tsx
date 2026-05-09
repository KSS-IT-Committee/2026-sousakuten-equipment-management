"use client";

import Link from "next/link";

import styles from "./home_button.module.css";

export default function HomeButton() {
  return (
    <Link href="/" className={styles.homeButton}>
      ← ホームに戻る
    </Link>
  );
}
