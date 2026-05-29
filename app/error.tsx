"use client";

import Link from "next/link";
import { useEffect } from "react";

import styles from "./error.module.css";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <>
      <main className={styles.wrapper}>
        <h1 className={styles.code}>500</h1>
        <p className={styles.title}>システムエラーが発生しました</p>
        <p className={styles.subtitle}>
          申し訳ありません。予期せぬエラーが発生しました。
          <br />
          時間をおいて再度お試しいただくか、管理者にお問い合わせください。
        </p>

        <div className={styles.subtitle}>
          <p>お急ぎの場合は、</p>
          <ul className={styles.contactList}>
            <li>IT委員会までお知らせください</li>
            <li>
              または、
              <a href="mailto:koishikawa.itcommittee@gmail.com">
                koishikawa.itcommittee@gmail.com
              </a>
              までお問い合わせください
            </li>
          </ul>
        </div>
        <div className={styles.divider} />

        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <button
            onClick={() => reset()}
            className={styles.homeLink}
            style={{ background: "transparent", cursor: "pointer" }}
          >
            再試行する
          </button>

          <Link href="/" className={styles.homeLink}>
            トップへ戻る
          </Link>
        </div>
      </main>
    </>
  );
}
