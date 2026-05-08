import "@/assets/class.json";

import Data from "@/assets/class.json";

interface ClassInfo {
  grade: number;
  id: number;
  name: string;
}
export function getClassString(classNumber: number): string {
  const gen: number = Math.floor(classNumber / 10);
  const cls: number = classNumber % 10;
  const classData = Data;
  const classInfo = classData.class.find(
    (c: ClassInfo) => c.grade === gen && c.id === cls,
  );
  return classInfo ? `${classInfo.name}` : "不明なクラス";
}

export function getClassNumber(className: string): number | null {
  const classData = Data;
  const classInfo = classData.class.find(
    (c: ClassInfo) => c.name === className,
  );
  if (classInfo) {
    return classInfo.grade * 10 + classInfo.id;
  }
  return null;
}
