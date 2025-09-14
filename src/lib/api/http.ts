import { getCookie } from "@/lib/auth/cookies"; // ✅ 토큰 가져오기 추가
import { DEFAULT_HEADERS, DEFAULT_TIMEOUT_MS } from "./config";
import { ApiError, ServerErrorBody } from "./errors";

export interface HttpInit extends RequestInit {
  timeoutMs?: number;
}

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
      const token = getCookie("accessToken"); // ✅ 쿠키에서 토큰 읽기

      res = await fetch(url, {
        ...fetchInit,
        headers: {
          ...DEFAULT_HEADERS,
          ...(headers ?? {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}), // ✅ 있으면 Authorization 붙이기
        },
        signal,
        cache,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return [] as T;
      }
      console.error("HTTP 요청 실패:", err);
      return [] as T;
    }

    const body = await res.json().catch(() => ({}));
    const serverMessage = body?.result?.message || body?.message || "요청 실패";

    if (res.status === 401) {
      throw new ApiError(serverMessage, {
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
        return [] as T;
      }
      if (Array.isArray(body.data)) {
        return body.data as T;
      }
      return body.data as T;
    }

    if (res.ok) return body as T;

    throw new ApiError(serverMessage, {
      status: res.status,
      code: body?.result?.code || body?.code,
      details: body as ServerErrorBody,
    });
  } finally {
    clearTimeout(timer);
  }
}