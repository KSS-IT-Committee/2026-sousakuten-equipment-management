"use client";

import Link from "next/link";
import { useState } from "react";

import styles from "./Navbar.module.css";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          創作展 貸出管理
        </Link>

        <button
          className={`${styles.hamburger} ${isMenuOpen ? styles.open : ""}`}
          onClick={toggleMenu}
          aria-label="メニュー"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}>
          <Link href="/" className={styles.homeLink} onClick={closeMenu}>
            ホーム
          </Link>
          <Link
            href="/add-equipment"
            className={styles.addEquipmentLink}
            onClick={closeMenu}
          >
            備品追加
          </Link>
          <Link
            href="/deductions"
            className={styles.borrowingsLink}
            onClick={closeMenu}
          >
            減点管理
          </Link>
        </div>
      </div>
    </nav>
  );
}
