// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  const role = req.cookies.get('role')?.value;

  // 보호해야 하는 경로
  const isProtected = req.nextUrl.pathname.startsWith('/mypage') || req.nextUrl.pathname.startsWith('/admin');

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 관리자만 접근
  if (req.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mypage/:path*', '/admin/:path*'],
};