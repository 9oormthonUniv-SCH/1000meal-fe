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

    // ✅ 여기서 status 200이라도 data가 null이면 에러로 간주
    if (!res.ok || body?.data === null || body?.errors?.length > 0) {
      throw new ApiError("요청 실패", {
        status: res.status,
        code: body?.result?.code || body?.code,
        details: body as ServerErrorBody,
      });
    }

    // ✅ swagger 스타일 { data }
    if (body && typeof body === "object" && "data" in body) {
      return body.data as T;
    }
    
    return body as T;
  } finally {
    clearTimeout(timer);
  }
}