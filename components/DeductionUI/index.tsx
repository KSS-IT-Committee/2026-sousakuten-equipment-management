import { DeductionCellsByClasses } from "@/components/ClassDeduction";
import { DeductionSumsList } from "@/components/DeductionLists";
import AddDeductionUI from "@/components/DeductionPopup";
import SelectButtons from "@/components/UiButtons";
import { CLASSES, type ClassName } from "@/db/schema";

export type DeductionSortKey =
  | "className"
  | "id"
  | "occurredAt"
  | "points"
  | "content";
export type DeductionSortOrder = "asc" | "desc";

const deductionSortKeys: DeductionSortKey[] = [
  "className",
  "id",
  "occurredAt",
  "points",
  "content",
];
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
  const sortBy = deductionSortKeys.includes(
    resolvedSearchParams?.sortBy as DeductionSortKey,
  )
    ? (resolvedSearchParams?.sortBy as DeductionSortKey)
    : "occurredAt";
  const sortOrder = deductionSortOrders.includes(
    resolvedSearchParams?.sortOrder as DeductionSortOrder,
  )
    ? (resolvedSearchParams?.sortOrder as DeductionSortOrder)
    : "desc";
  const classParams = resolvedSearchParams?.class;
  const rawSelectedClasses = Array.isArray(classParams)
    ? classParams
    : classParams
      ? [classParams]
      : [];
  const selectedClasses = rawSelectedClasses.filter(
    (className): className is ClassName =>
      CLASSES.includes(className as ClassName),
  );
  const hasClassFilter = selectedClasses.length > 0;
  const classesToDisplay = hasClassFilter ? selectedClasses : CLASSES;

  return (
    <main>
      <AddDeductionUI />
      <SelectButtons />
      <div>
        {section === 1 && hasClassFilter ? (
          <DeductionCellsByClasses
            classes={classesToDisplay}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        ) : null}
        {section === 2 ? <DeductionSumsList /> : null}
        {section === 3 ? (
          <>
            <AddDeductionUI />
          </>
        ) : null}
      </div>
    </main>
  );
}
