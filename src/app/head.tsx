// src/app/head.tsx
import Script from "next/script";

export default function Head() {
  return (
    <>
      <title>천원의 아침밥</title>
      <meta name="description" content="학생들을 위한 조식 서비스" />
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`}
        strategy="beforeInteractive"
      />
    </>
  );
}