import Link from "next/link";

import { Internal } from "@/components/Internal";

import styles from "./Navbar.module.css";

/**
 * The auth-gated nav links shown inside the Navbar's collapsible menu. Rendered
 * on the server so it can read the shared session; the layout wraps it in
 * <Internal> so it only renders for logged-in school accounts. Menu open/close
 * lives in the client Navbar, which receives this as a slot.
 *
 * Equipment management is committee-only, so the 備品追加 link is further gated
 * to the Sousakuten role; everyone internal still sees ホーム and 減点管理.
 */
export function NavMenuLinks() {
  return (
    <>
      <Link href="/" className={styles.homeLink}>
        ホーム
      </Link>
      <Internal role="Sousakuten">
        <Link href="/add-equipment" className={styles.addEquipmentLink}>
          備品追加
        </Link>
      </Internal>
      <Link href="/deductions" className={styles.borrowingsLink}>
        減点管理
      </Link>
    </>
  );
}
