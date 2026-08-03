// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  if (request.nextUrl.pathname.startsWith("/deductions")) {
    if (!session) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/deductions/:path*"],
};

