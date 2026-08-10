import { Suspense } from "react";

import { AuthGuard } from "@/components/AuthGuard";
import { DeductionUI } from "@/components/DeductionUI";
import { PageLoading } from "@/components/PageLoading";
import { INTERNAL_ROLES } from "@/lib/access";

import styles from "./page.module.css";

type Props = {
  searchParams?: Promise<{
    section?: string;
    sortBy?: string;
    sortOrder?: string;
    class?: string | string[];
  }>;
};

// AuthGuard stays in the static shell so its 401/403 is still a real status
// code; only the DB-backed listing streams behind the boundary.
export default function Deductions({ searchParams }: Props) {
  return (
    <AuthGuard role={INTERNAL_ROLES}>
      <div style={{ width: "100%", marginBottom: "24px" }}>
        <h1 className={styles.pageTitle}>創作展 減点処理サイト</h1>
        <h2 className={styles.pageSubtitle}>
          各クラスの減点内容とポイントを管理するサイト
        </h2>
      </div>
      <Suspense fallback={<PageLoading />}>
        <DeductionUI searchParams={searchParams} />
      </Suspense>
    </AuthGuard>
  );
}
