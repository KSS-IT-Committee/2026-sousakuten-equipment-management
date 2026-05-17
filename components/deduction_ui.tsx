import { DeductionCellsByClasses } from "@/components/classdeduction";
import { DeductionForTest } from "@/components/deductionfortest";
import SelectButtons from "./ui_buttons";

type Props = {
  searchParams?: Promise<{ section?: string }>;
};

export async function DeductionUI({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const section = Number(resolvedSearchParams?.section ?? "1");
  return (
    <main>
      <SelectButtons />
      <div>
        {section === 1 ? <DeductionCellsByClasses
          classes={[
            "1A",
            "1B",
            "1C",
            "1D",
            "2A",
            "2B",
            "2C",
            "2D",
            "3A",
            "3B",
            "3C",
            "3D",
            "4A",
            "4B",
            "4C",
            "4D",
            "5A",
            "5B",
            "5C",
            "5D",
          ]}
        /> : null}
        {section === 2 ? (
          <div>総合減点数（未実装）</div>
        ) : null}
        {section === 3 ? <DeductionForTest /> : null}
      </div>
    </main >

  );
}
