"use server";

import { cookies } from "next/headers";

export type AuthCheckResult = {
  isLoggedIn: boolean;
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
      };
    }

    return {
      isLoggedIn: false,
      error: "ログインしていません。",
    };
  } catch {
    return {
      isLoggedIn: false,
      error: "認証処理中にエラーが発生しました。",
    };
  }
}
