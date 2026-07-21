import "server-only";

import { hasAnyRole } from "@/lib/access";
import { getCurrentUser } from "@/lib/session";
import { classOf } from "@/lib/user-category";

// The committee role allowed to manage *equipment*: add/edit/delete equipment
// and borrow/return. Reading (the equipment catalog, a class's own deductions)
// stays open to any logged-in school account.
const ADMIN_ROLE = "Sousakuten";
// The committee role allowed to manage *deductions*: view all classes, add,
// and delete. Plain Sousakuten members see deductions like any other student.
const DEDUCTION_ADMIN_ROLE = "SousakutenMain";

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return hasAnyRole(user, ADMIN_ROLE);
}

export async function isDeductionAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return hasAnyRole(user, DEDUCTION_ADMIN_ROLE);
}

/**
 * Assert the caller holds the committee role; throws otherwise. Call this at the
 * top of every mutating server action — AuthGuard / Internal only gate
 * rendering, so an action stays directly invocable by anyone without it.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("この操作には創作展委員の権限が必要です");
  }
}

export async function requireDeductionAdmin(): Promise<void> {
  if (!(await isDeductionAdmin())) {
    throw new Error("この操作には創作展委員（幹部）の権限が必要です");
  }
}

export type Viewer = {
  username: string;
  canManageDeductions: boolean;
  /** The viewer's own class (e.g. "3B"), or null for staff/committee accounts. */
  className: string | null;
};

/**
 * The current viewer with their canManageDeductions flag and own class, or
 * null if not logged in. Drives read-scoping: SousakutenMain sees every
 * class, everyone else only their own.
 */
export async function getViewer(): Promise<Viewer | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return {
    username: user.username,
    canManageDeductions: hasAnyRole(user, DEDUCTION_ADMIN_ROLE),
    className: classOf(user.username),
  };
}
