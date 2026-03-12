// src/lib/api/config.ts
/**
 * 브라우저에서는 같은 오리진(`/api/v1`)으로 호출해서 Next rewrites(/api -> NEXT_PUBLIC_API_URL) 프록시를 타게 합니다.
 * - HTTPS 배포 환경에서 HTTP 테스트 서버로 직접 호출 시 mixed content/CORS가 발생할 수 있음
 * - 같은 오리진 호출 + 서버 프록시로 우회
 */
export const API_BASE =
  typeof window === "undefined"
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
    : "/api/v1";
export const DEFAULT_HEADERS = { "Content-Type": "application/json" } as const;
export const DEFAULT_TIMEOUT_MS = 20000;