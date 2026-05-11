"use client";

import Link from "next/link";

import styles from "@/styles/navbar.module.css";

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          創作展　貸出管理
        </Link>
        <div className={styles.links}>
          <Link href="/" className={styles.homeLink}>
            ホーム
          </Link>
          <Link href="/add-equipment" className={styles.addLink}>
            機器追加
          </Link>
        </div>
      </div>
    </nav>
  );
}
