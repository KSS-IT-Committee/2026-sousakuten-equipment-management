import "server-only";

import { hasAccess } from "@/lib/access";
import { getCurrentUser } from "@/lib/session";
import { classOf } from "@/lib/user-category";

// The committee role allowed to *manage* this app: add/edit/delete equipment,
// borrow/return, and add/delete deductions. Reading (the equipment catalog, a
// class's own deductions) stays open to any logged-in school account.
const ADMIN_ROLE = "Sousakuten";

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return hasAccess(user.username, ADMIN_ROLE, undefined);
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

export type Viewer = {
  username: string;
  isAdmin: boolean;
  /** The viewer's own class (e.g. "3B"), or null for staff/committee accounts. */
  className: string | null;
};

/**
 * The current viewer with their admin flag and own class, or null if not logged
 * in. Drives read-scoping: admins see every class, everyone else only their own.
 */
export async function getViewer(): Promise<Viewer | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return {
    username: user.username,
    isAdmin: await hasAccess(user.username, ADMIN_ROLE, undefined),
    className: classOf(user.username),
  };
}
