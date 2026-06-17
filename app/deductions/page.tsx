import { AuthGuard } from "@/components/AuthGuard";
import { DeductionUI } from "@/components/DeductionUI";
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
        <h1 className="text-4xl font-bold text-center">
          創作展 減点処理サイト
        </h1>
        <h2 className="text-2xl text-center mt-4">
          各クラスの減点内容とポイントを管理するサイト
        </h2>
      </div>
      <DeductionUI searchParams={searchParams} />
    </AuthGuard>
  );
}
