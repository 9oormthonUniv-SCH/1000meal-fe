// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** 웹 서비스 앱 마이그레이션: 허용 경로만 열고 나머지는 메인으로 리다이렉트 */
const ALLOWED_PATHS = ["/", "/appDownload", "/qa"];

function isAllowedPath(pathname: string): boolean {
  if (ALLOWED_PATHS.includes(pathname)) return true;
  // 정적/API 경로
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/icons") || pathname.startsWith("/firebase")) return true;
  if (pathname === "/favicon.ico") return true;
  // public 폴더 정적 파일 (확장자로 구분)
  if (/\/[^/]+\.[a-z0-9]{2,4}$/i.test(pathname)) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (isAllowedPath(pathname)) {
    return NextResponse.next();
  }
  // 기존 웹 앱 경로 접근 시 메인(서비스 소개)으로 이동
  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|icons|favicon.ico).*)",
  ],
};