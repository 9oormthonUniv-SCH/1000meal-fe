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

  // 외부 signal이 있으면 그걸 우선, 없으면 내부 controller 사용
  const signal = externalSignal ?? controller.signal;
  try {
    const res = await fetch(url, {
      ...fetchInit,
      headers: { ...DEFAULT_HEADERS, ...(headers ?? {}) },
      signal,
      cache,
      credentials: "include",
    });

    const contentType = res.headers.get("content-type") ?? "";

    // 공통 바디 파서
    const parseBody = async (): Promise<unknown> => {
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

    // ⛔️ HTTP 에러
    // http.ts
    if (!res.ok) {
      const raw = await parseBody();

      let message: string;
      if (raw && typeof raw === "object" && "message" in (raw as any)) {
        message = String((raw as any).message);
      } else if (typeof raw === "string" && raw.trim()) {
        message = raw; // 서버가 그냥 문자열로 내려줬을 때
      } else {
        message = `[${res.status}] ${res.statusText}`;
      }

      throw new ApiError(message, {
        status: res.status,
        details: raw,
      });
    }

    // 204 No Content
    if (res.status === 204) {
      return undefined as unknown as T;
    }

    // ✅ 정상 응답
    const body = await parseBody();

    if (contentType.includes("application/json")) {
      const json = body as any;

      // 스웨거 스타일 래핑 자동 언랩
      if (
        unwrapData &&
        json &&
        typeof json === "object" &&
        "data" in json
      ) {
        return (json.data as unknown) as T;
      }

      return json as T;
    }

    // 그 외는 텍스트/바이너리 등 그대로 반환
    return (body as unknown) as T;
  } catch (e: unknown) {
    // 요청 취소
    if (e instanceof DOMException && e.name === "AbortError") {
      // 그냥 요청 취소는 정상 플로우로 간주
      return undefined as unknown as T;
    }
    // 네트워크 오류(fetch 자체 실패)
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