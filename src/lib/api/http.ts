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
    let res: Response;
    try {
      res = await fetch(url, {
        ...fetchInit,
        headers: { ...DEFAULT_HEADERS, ...(headers ?? {}) },
        signal,
        cache,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // ✅ 요청 취소 → 그냥 무시 (throw 하지 않고 조용히 return)
        return [] as T;
      }
      console.error("HTTP 요청 실패:", err);
      return [] as T;
    }

    const body = await res.json().catch(() => ({}));
    console.log(body);

    if (res.status === 401) {
      throw new ApiError("Unauthorized", {
        status: 401,
        code: body?.result?.code || body?.code,
        details: body as ServerErrorBody,
      });
    }

    if (res.status === 404) {
      return { dailyMenus: [] } as unknown as T;
    }

    if (body && typeof body === "object" && "data" in body) {
      if (body.data === null) {
        return [] as T; // ✅ null → 빈 배열
      }
      if (Array.isArray(body.data)) {
        return body.data as T; // ✅ 배열인 경우
      }
      return body.data as T;
    }

    if (res.ok) {
      return body as T;
    }

    throw new ApiError("요청 실패", {
      status: res.status,
      code: body?.result?.code || body?.code,
      details: body as ServerErrorBody,
    });
  } finally {
    clearTimeout(timer);
  }
}