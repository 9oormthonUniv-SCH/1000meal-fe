import type { Metadata } from "next";
import Script from "next/script";
import { PwaHead } from "./_pwa-head";
import "./globals.css";

export const metadata: Metadata = {
  title: "오늘순밥",
  description: "순천향대학교 천원의 아침밥 실시간 수량 확인 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/icons/logo.png" type="image/png" />
        <PwaHead />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
