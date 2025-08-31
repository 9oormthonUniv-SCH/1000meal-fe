// src/lib/api/http.ts
import { DEFAULT_HEADERS, DEFAULT_TIMEOUT_MS } from "./config";
import { ApiError, ServerErrorBody } from "./errors";

export interface HttpInit extends RequestInit {
  timeoutMs?: number;
}

// src/lib/api/http.ts
export async function http<T>(url: string, init: HttpInit = {}): Promise<T> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    headers,
    signal: externalSignal,
    cache = "no-store",
    ...fetchInit
  } = init;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const signal = externalSignal ?? controller.signal;

  try {
    const res = await fetch(url, {
      ...fetchInit,
      headers: { ...DEFAULT_HEADERS, ...(headers ?? {}) },
      signal,
      cache,
    });

    const body = await res.json().catch(() => ({}));

    // ✅ 404는 빈 데이터로 리턴
    if (res.status === 404) {
      return { dailyMenus: [] } as unknown as T;
    }

    // ✅ swagger 스타일 { data: ... } → null도 허용
    if (body && typeof body === "object" && "data" in body) {
      if (body.data === null) {
        return {} as T; // null이면 빈 객체로
      }
      return body.data as T;
    }

    // ✅ 그 외 ok 응답이면 그대로 반환
    if (res.ok) {
      return body as T;
    }

    // ❌ 나머지는 에러
    throw new ApiError("요청 실패", {
      status: res.status,
      code: body?.result?.code || body?.code,
      details: body as ServerErrorBody,
    });
  } finally {
    clearTimeout(timer);
  }
}