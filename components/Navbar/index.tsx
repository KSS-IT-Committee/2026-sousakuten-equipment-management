"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";

import styles from "./Navbar.module.css";

type NavbarProps = {
  // Server-rendered login control, passed in from the layout (this is a
  // client component, so it can't render the async AccountNav itself).
  accountSlot?: ReactNode;
};

export function Navbar({ accountSlot }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className={styles.navbar} ref={navRef}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          創作展 貸出管理
        </Link>

        {accountSlot ? (
          <div className={styles.account}>{accountSlot}</div>
        ) : null}

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
