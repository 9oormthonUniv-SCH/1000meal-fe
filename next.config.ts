import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`, // BE 주소
      },
    ];
  },
  images: {
    // unoptimized: true로 설정하면 Vercel 이미지 최적화 서버를 거치지 않고
    // 브라우저에서 S3 이미지를 직접 로드합니다.
    // 이렇게 하면 Vercel 서버가 S3에 접근할 필요가 없어서 CORS 문제를 피할 수 있습니다.
    unoptimized: true,
    disableStaticImages: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1000mealsql.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;