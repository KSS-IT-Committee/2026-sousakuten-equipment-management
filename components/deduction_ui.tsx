import { DeductionCellsByClasses } from "@/components/classdeduction";
import { DeductionForTest } from "@/components/deductionfortest";
import { CLASSES, type ClassName } from "@/db/schema";
import AddDeductionUI from "./deduction_popup";
import { DeductionSumsList } from "./deductionlists";
import SelectButtons from "./ui_buttons";

export type DeductionSortKey = "className" | "id" | "occurredAt" | "points" | "content";
export type DeductionSortOrder = "asc" | "desc";

const deductionSortKeys: DeductionSortKey[] = ["className", "id", "occurredAt", "points", "content"];
const deductionSortOrders: DeductionSortOrder[] = ["asc", "desc"];

type Props = {
  searchParams?: Promise<{
    section?: string;
    sortBy?: string;
    sortOrder?: string;
    class?: string | string[];
  }>;
};

export async function DeductionUI({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const section = Number(resolvedSearchParams?.section ?? "1");
  const sortBy = deductionSortKeys.includes(resolvedSearchParams?.sortBy as DeductionSortKey)
    ? (resolvedSearchParams?.sortBy as DeductionSortKey)
    : "occurredAt";
  const sortOrder = deductionSortOrders.includes(resolvedSearchParams?.sortOrder as DeductionSortOrder)
    ? (resolvedSearchParams?.sortOrder as DeductionSortOrder)
    : "desc";
  const classParams = resolvedSearchParams?.class;
  const hasClassFilter = classParams !== undefined;
  const rawSelectedClasses = Array.isArray(classParams)
    ? classParams
    : classParams
      ? [classParams]
      : [];
  const selectedClasses = rawSelectedClasses.filter((className): className is ClassName =>
    CLASSES.includes(className as ClassName),
  );
  const classesToDisplay = hasClassFilter
    ? selectedClasses
    : CLASSES;

  return (
    <main>
      <AddDeductionUI />
      <SelectButtons />
      <div>
        {section === 1 ? <DeductionCellsByClasses
          classes={classesToDisplay}
          sortBy={sortBy}
          sortOrder={sortOrder}
        /> : null}
        {section === 2 ? (
          <DeductionSumsList />
        ) : null}
        {section === 3 ? <><AddDeductionUI /><DeductionForTest /></> : null}
      </div>
    </main >

  );
}
