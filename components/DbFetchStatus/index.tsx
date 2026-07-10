import { getLastDbFetch } from "@/lib/db-last-fetched";

import styles from "./DbFetchStatus.module.css";

export function DbFetchStatus() {
  const { at} = getLastDbFetch();

  return (
    <section className={styles.card} aria-label="DB取得状況">
      <div className={styles.label}>最終更新時刻</div>
      <div className={styles.value}>
        {at ? (
          <>
            <span>
              {at.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
            </span>
          </>
        ) : (
          <span>まだ取得されていません</span>
        )}
      </div>
    </section>
  );
}
