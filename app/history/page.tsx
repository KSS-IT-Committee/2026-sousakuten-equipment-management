import { notFound } from "next/navigation";

import DeleteDeductionButton from "@/components/deletededuction_button";
import { getDeductionsById } from "@/db/queries/deductions";

import styles from "./base.module.css";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { id } = await searchParams;
  const deductionId = Number(id);

  if (!id || Number.isNaN(deductionId)) {
    notFound();
  }

  const deduction = await getDeductionsById(deductionId);

  if (!deduction) {
    notFound();
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-start">
      <div className={styles.window}>
        <h1>減点の詳細</h1>
        <h2>ID: #{deduction.id}</h2>
        <h2>クラス: {deduction.className}</h2>
        <h2>減点ポイント: {deduction.points}点</h2>
        <h2>内容: {deduction.content}</h2>
        <h2>日時: {deduction.occurredAt.toLocaleString("ja-JP")}</h2>
      </div>
      <DeleteDeductionButton deductionId={deduction.id} />


    </main>
  )
}
