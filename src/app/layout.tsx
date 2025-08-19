import Footer from "@/components/common/Footer";
import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "천원의 아침밥",
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
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`}
          strategy="beforeInteractive"
        />
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