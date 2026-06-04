import BackButton from "@/components/BackButton";
import DeleteDeductionButton from "@/components/DeleteDeductionButton";
import { getDeductionsById } from "@/db/queries/deductions";
import { redirect } from "next/navigation";
import styles from "./base.module.css";

import { checkUserAuth } from "@/lib/auth";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { id } = await searchParams;
  const deductionId = Number(id);

  if (Number.isNaN(deductionId) || deductionId <= 0) {
    return <p>エラー: 無効なID</p>;
  }

  const deduction = await getDeductionsById(deductionId);

  const perm = await checkUserAuth();
  if (!perm.isLoggedIn) {
    redirect("/");
  }
  if (deduction === undefined) {
    return <p>エラー: 無効なID</p>;
  }

  return (
    <>
      <div className={styles.window}>
        <h1>減点の詳細</h1>
        <h2>ID: #{deduction.id}</h2>
        <h2>クラス: {deduction.className}</h2>
        <h2>減点ポイント: {deduction.points}点</h2>
        <h2>内容: {deduction.content}</h2>
        <h2>
          日時:{" "}
          {deduction.occurredAt.toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo",
          })}
        </h2>
        <BackButton />
      </div>
      <div className={styles.buttonRow}>
        <DeleteDeductionButton deductionId={deduction.id} />
      </div>
    </>
  );
}
