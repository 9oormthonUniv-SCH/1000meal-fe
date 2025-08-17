import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type UseApiOptions<T> = {
  /** 초깃값 (Skeleton 렌더링 피하고 싶을 때) */
  initialData?: T;
  /** 자동 실행 여부 (기본 true) */
  enabled?: boolean;
};

/**
 * 파라미터 없는 fetcher 전용
 *   - fetcher: (signal?) => Promise<T>
 */
export function useApi<T>(
  fetcher: (signal?: AbortSignal) => Promise<T>,
  deps: any[] = [],
  options: UseApiOptions<T> = {}
) {
  const { initialData, enabled = true } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const c = new AbortController();
    abortRef.current = c;
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher(c.signal);
      setData(res);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setError(e?.message ?? "요청에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (!enabled) return;
    void load();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return { data, loading, error, reload: load };
}

/**
 * 파라미터 있는 fetcher 전용
 *   - fetcher: (args, signal?) => Promise<T>
 *   - args 변화에 따라 자동 재요청
 */
export function useApiWithParams<T, A>(
  fetcher: (args: A, signal?: AbortSignal) => Promise<T>,
  args: A,
  deps: any[] = [],
  options: UseApiOptions<T> = {}
) {
  const fn = useMemo(
    () => (signal?: AbortSignal) => fetcher(args, signal),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(args)] // args가 객체면 안전하게 직렬화 비교
  );
  return useApi<T>(fn, deps, options);
}