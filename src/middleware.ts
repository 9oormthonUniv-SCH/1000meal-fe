// src/middleware.ts
import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  const isProtected =
    req.nextUrl.pathname.startsWith("/mypage") ||
    req.nextUrl.pathname.startsWith("/admin");

  // 로그인 안 된 사용자 보호 경로 접근 차단
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 관리자 페이지 접근 제한
  if (token) {
    try {
      const decoded = jwtDecode<{ role?: string }>(token);

      if (req.nextUrl.pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      // 토큰 파싱 실패 → 로그인 페이지로
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mypage/:path*", "/admin/:path*"],
};