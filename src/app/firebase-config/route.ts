import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Service Worker(importScripts)에서 읽을 수 있도록 Firebase 설정을 JS로 내려줍니다.
 * - SW는 public 파일이라 빌드타임 env 주입이 어려워서, 런타임 route로 제공합니다.
 * - importScripts('/firebase-config') 형태로 사용
 */
export function GET() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };

  const js = `self.__FIREBASE_CONFIG__ = ${JSON.stringify(config)};`;

  return new NextResponse(js, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

