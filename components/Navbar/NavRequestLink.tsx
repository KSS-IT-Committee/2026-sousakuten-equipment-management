import Link from "next/link";

import styles from "./Navbar.module.css";

export function NavRequestLink() {
  return (
    <Link href="/requests" className={styles.requestLink}>
      機能・修正のリクエスト
    </Link>
  );
}
