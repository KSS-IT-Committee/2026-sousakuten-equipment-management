"use server";

import { cookies } from "next/headers";

export type AuthCheckResult = {
  isLoggedIn: boolean;
  role: "admin" | "user" | null;
  error?: string;
};
export async function checkUserAuth(): Promise<AuthCheckResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    // TODO: modify this logic @rotarymars
    if (token) {
      return {
        isLoggedIn: true,
        role: "admin",
      };
    }

    return {
      isLoggedIn: false,
      role: null,
      error: "ログインしていません。",
    };
  } catch {
    return {
      isLoggedIn: false,
      role: null,
      error: "認証処理中にエラーが発生しました。",
    };
  }
}
