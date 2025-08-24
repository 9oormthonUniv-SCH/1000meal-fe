// src/lib/api/http.ts
import { DEFAULT_HEADERS, DEFAULT_TIMEOUT_MS } from "./config";
import { ApiError, extractServerMessage } from "./errors";

export interface HttpInit extends RequestInit {
  timeoutMs?: number;
  /** JSON 응답에서 { data }를 자동 언랩할지 (기본 true) */
  unwrapData?: boolean;
}

export async function http<T>(url: string, init: HttpInit = {}): Promise<T> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    unwrapData = true,
    headers,
    signal: externalSignal,
    cache = "no-store",
    ...fetchInit
  } = init;

  const controller = new AbortController();
  const timer = timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : null;
  const signal = externalSignal ?? controller.signal;

  try {
    const res = await fetch(url, {
      ...fetchInit,
      headers: { ...DEFAULT_HEADERS, ...(headers ?? {}) },
      signal,
      cache,
      credentials: "include", // ✅ 세션 쿠키 포함
    });

    // 공통 body 파서
    const parseBody = async (): Promise<unknown> => {
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        try {
          return await res.json();
        } catch {
          return null;
        }
      }
      try {
        return await res.text();
      } catch {
        return null;
      }
    };

    // ⛔️ HTTP 에러 처리
    if (!res.ok) {
      const { message, code, body } = await extractServerMessage(res);
      throw new ApiError(message, {
        status: res.status,
        code,
        details: body,
      });
    }

    // 204 No Content
    if (res.status === 204) {
      return undefined as unknown as T;
    }

    // ✅ 정상 응답
    const body = await parseBody();
    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const json = body as Record<string, unknown>;

      // 스웨거 스타일 { data } 언랩
      if (unwrapData && json && typeof json === "object" && "data" in json) {
        return json.data as T;
      }

      return json as T;
    }

    // 그 외 텍스트/바이너리 그대로 반환
    return body as T;
  } catch (e: unknown) {
    // 요청 취소
    if (e instanceof DOMException && e.name === "AbortError") {
      return undefined as unknown as T;
    }
    // 네트워크 오류
    if (e instanceof TypeError) {
      throw new ApiError("네트워크 오류", { isNetwork: true });
    }
    if (e instanceof ApiError) throw e;

    const msg = e instanceof Error ? e.message : "요청 실패";
    throw new ApiError(msg);
  } finally {
    if (timer) clearTimeout(timer);
  }
}