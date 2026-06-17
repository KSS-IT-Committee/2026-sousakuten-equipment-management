"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";

import styles from "./Navbar.module.css";

type NavbarProps = {
  // Server-rendered login control, passed in from the layout (this is a
  // client component, so it can't render the async AccountNav itself).
  accountSlot?: ReactNode;
  // Server-rendered, auth-gated nav links (the layout wraps them in <Internal>).
  // Rendered inside the collapsible menu; empty for signed-out / non-internal
  // visitors, in which case `.navLinks:empty` (CSS) hides the menu entirely.
  navSlot?: ReactNode;
};

export function Navbar({ accountSlot, navSlot }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Close the menu when a navigation changes the route (covers clicks on the
  // gated links in navSlot, which are server-rendered and can't carry an
  // onClick). Adjusting state during render — rather than in an effect — keeps
  // it in sync without an extra paint. See react.dev "You Might Not Need an
  // Effect".
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setIsMenuOpen(false);
  }

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
          {navSlot}
        </div>
      </div>
    </nav>
  );
}
