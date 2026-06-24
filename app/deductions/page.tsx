import { AuthGuard } from "@/components/AuthGuard";
import { DeductionUI } from "@/components/DeductionUI";

import styles from "./page.module.css";

type Props = {
  searchParams?: Promise<{
    section?: string;
    sortBy?: string;
    sortOrder?: string;
    class?: string | string[];
  }>;
};

export default async function Deductions({ searchParams }: Props) {
  return (
    <AuthGuard>
      <div style={{ width: "100%", marginBottom: "24px" }}>
        <h1 className={styles.pageTitle}>創作展 減点処理サイト</h1>
        <h2 className={styles.pageSubtitle}>
          各クラスの減点内容とポイントを管理するサイト
        </h2>
      </div>
      <DeductionUI searchParams={searchParams} />
    </AuthGuard>
  );
}
