import Footer from "@/components/common/Footer";
import type { Metadata } from "next";
import Script from "next/script";
import { PwaHead } from "./_pwa-head";
import "./globals.css";

export const metadata: Metadata = {
  title: "오늘 순밥",
  description: "대학생을 위한 아침 식사 정보 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <PwaHead />
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`}
          strategy="beforeInteractive"
        />
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
      <body className="bg-gray-200">
        <div className="flex justify-center">
          <div className="w-full max-w-md h-dvh bg-white flex flex-col overflow-hidden">
            {/* ✅ 내부 스크롤 영역 */}
            <main id="app-main" className="overflow-y-auto flex-1 scrollbar-hide">
              <div className="min-h-full flex flex-col">
                {children}
                <div className="mt-auto">
                  <Footer />
                </div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}