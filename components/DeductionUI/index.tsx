import { DeductionCellsByClasses } from "@/components/ClassDeduction";
import { DeductionSumsList } from "@/components/DeductionLists";
import AddDeductionUI from "@/components/DeductionPopup";
import SelectButtons from "@/components/UiButtons";
import { CLASSES, type ClassName } from "@/db/schema";
import { getViewer } from "@/lib/authorize";

export type DeductionSortKey =
  "className" | "id" | "occurredAt" | "points" | "content";
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

  // Non-admins are scoped to their own class: no add control, no class filter,
  // no all-class ranking, and the `class` query param is ignored. The data
  // query is pinned to their class so `/deductions?class=5A` can't reveal it.
  const viewer = await getViewer();
  if (!viewer?.isAdmin) {
    const ownClass = viewer?.className ?? null;
    if (ownClass === null || !CLASSES.includes(ownClass as ClassName)) {
      return <p className="text-center mt-8">表示できる減点はありません。</p>;
    }
    return (
      <DeductionCellsByClasses
        classes={[ownClass as ClassName]}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    );
  }

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
    <>
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
      </div>
    </>
  );
}
