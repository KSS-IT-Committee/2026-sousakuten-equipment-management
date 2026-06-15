const STUDENT_RE = /^[1-6][A-D]\d{2}$/; // 1A01 … 6D40
const TEACHER_RE = /^k/; // k-prefixed staff accounts

export function isInternal(username: string): boolean {
  return STUDENT_RE.test(username) || TEACHER_RE.test(username);
}
