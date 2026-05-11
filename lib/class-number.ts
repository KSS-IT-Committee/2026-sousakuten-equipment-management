// Replace JSON-based class list with enum-like codes.
export const CLASS_CODES = [
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
  "6A",
  "6B",
  "6C",
  "6D",
] as const;

export type ClassCode = (typeof CLASS_CODES)[number];

const CLASS_LABELS: Record<ClassCode, string> = {
  "1A": "1年A組",
  "1B": "1年B組",
  "1C": "1年C組",
  "1D": "1年D組",
  "2A": "2年A組",
  "2B": "2年B組",
  "2C": "2年C組",
  "2D": "2年D組",
  "3A": "3年A組",
  "3B": "3年B組",
  "3C": "3年C組",
  "3D": "3年D組",
  "4A": "4年A組",
  "4B": "4年B組",
  "4C": "4年C組",
  "4D": "4年D組",
  "5A": "5年A組",
  "5B": "5年B組",
  "5C": "5年C組",
  "5D": "5年D組",
  "6A": "6年A組",
  "6B": "6年B組",
  "6C": "6年C組",
  "6D": "6年D組",
};

export function getClassLabel(code: string): string {
  if (CLASS_CODES.includes(code as ClassCode)) {
    return CLASS_LABELS[code as ClassCode];
  }
  return "不明なクラス";
}

export function makeClassCode(grade: number, id: number): ClassCode | null {
  const letter = String.fromCharCode(64 + id); // 1 -> 'A'
  const code = `${grade}${letter}` as ClassCode;
  return CLASS_CODES.includes(code) ? code : null;
}
