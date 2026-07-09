"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./floating.module.css";

const DEFAULT_COLLAPSE_DELAY_MS = 2000;

export type FloatingMenuItem = {
  label: string;
  href: string;
};

type FloatingMenuProps = {
  items: FloatingMenuItem[];
  collapseDelayMs?: number;
};

export function FloatingMenu({
  items,
  collapseDelayMs = DEFAULT_COLLAPSE_DELAY_MS,
}: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const scheduleCollapse = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsOpen(false), collapseDelayMs);
  }, [collapseDelayMs]);

  const cancelCollapse = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const collapseNow = useCallback(() => {
    cancelCollapse();
    setIsOpen(false);
  }, [cancelCollapse]);

  useEffect(() => {
    scheduleCollapse();
    return () => cancelCollapse();
  }, [scheduleCollapse, cancelCollapse]);

  // Collapse when a pointer press lands outside the menu.
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        collapseNow();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, collapseNow]);

  // On devices with a mouse, collapse when the pointer leaves the viewport.
  useEffect(() => {
    if (!isOpen) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const handleMouseOut = (event: MouseEvent) => {
      // relatedTarget is null when the pointer leaves the browser window.
      if (event.relatedTarget === null) {
        collapseNow();
      }
    };

    document.addEventListener("mouseout", handleMouseOut);
    return () => document.removeEventListener("mouseout", handleMouseOut);
  }, [isOpen, collapseNow]);

  const handleOpen = () => {
    setIsOpen(true);
    scheduleCollapse();
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <nav
        id="floating-menu-nav"
        aria-hidden={!isOpen}
        className={`${styles.menu} ${isOpen ? styles.visible : styles.hidden}`}
        aria-label="ページ内ナビゲーション"
        onMouseEnter={cancelCollapse}
        onMouseLeave={collapseNow}
        onFocus={cancelCollapse}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            collapseNow();
          }
        }}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.link}
            tabIndex={isOpen ? 0 : -1}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        aria-expanded={isOpen}
        aria-controls="floating-menu-nav"
        type="button"
        className={`${styles.hamburger} ${
          isOpen ? styles.hidden : styles.visible
        }`}
        aria-label="メニューを開く"
        tabIndex={isOpen ? -1 : 0}
        onClick={handleOpen}
        onMouseEnter={handleOpen}
        onFocus={handleOpen}
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  );
}
