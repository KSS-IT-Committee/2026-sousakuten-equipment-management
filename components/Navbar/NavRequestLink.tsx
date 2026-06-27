import Link from "next/link";

import styles from "./Navbar.module.css";

export function NavRequestLink() {
  return (
    <Link href="/request" className={styles.requestLink}>
      機能のリクエスト
    </Link>
  );
}
