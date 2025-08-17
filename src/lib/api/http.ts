import { DEFAULT_HEADERS, DEFAULT_TIMEOUT_MS } from "./config";
import type { ApiEnvelope } from "@/types/store";

type HttpOptions = RequestInit & {
  timeoutMs?: number;
  signal?: AbortSignal;
};

/**
 * 공통 http 래퍼
 * - { data, result } 래핑/평문 모두 지원
 * - 4xx/5xx는 Error throw
 */
export async function http<T>(url: string, opts: HttpOptions = {}): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, headers, signal, ...rest } = opts;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...rest,
      headers: { ...DEFAULT_HEADERS, ...(headers ?? {}) },
      signal: signal ?? controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`[${res.status}] ${text || res.statusText}`);
    }

    const json = await res.json().catch(() => ({}));

    // 스웨거 래핑({ data, result }) or 평문 둘 다 허용
    const hasEnvelope = json && typeof json === "object" && "data" in json;
    return (hasEnvelope ? (json as ApiEnvelope<T>).data : (json as T)) as T;
  } finally {
    clearTimeout(timer);
  }
}