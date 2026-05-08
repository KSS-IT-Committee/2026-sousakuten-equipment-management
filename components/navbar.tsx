"use client";

import Link from "next/link";

import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          創作展　貸出管理
        </Link>
        <Link href="/" className={styles.homeLink}>
          ホーム
        </Link>
      </div>
    </nav>
  );
}
