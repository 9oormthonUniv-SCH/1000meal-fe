'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type DependencyList } from 'react';

type UseApiOptions<T> = {
  /** 초깃값 (Skeleton 회피용) */
  initialData?: T;
  /** 자동 실행 여부 (기본 true) */
  enabled?: boolean;
};

export function useApi<T>(
  fetcher: (signal?: AbortSignal) => Promise<T>,
  deps: DependencyList = [],
  options: UseApiOptions<T> = {}
) {
  const { initialData, enabled = true } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef<boolean>(false); // ✅ 누락된 부분 추가

  const load = useCallback(async () => {
    // 이전 요청 취소
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetcher(controller.signal);
      if (!mountedRef.current) return; // 언마운트되면 무시
      setData(res);
    } catch (err: unknown) {
      const isAbort =
        (err instanceof DOMException && err.name === 'AbortError') ||
        (err instanceof Error && err.name === 'AbortError');

      if (!isAbort) {
        const message = err instanceof Error ? err.message : '요청에 실패했습니다.';
        if (mountedRef.current) setError(message);
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    mountedRef.current = true;
    if (enabled) void load();

    return () => {
      // ✅ 순서: abort 먼저, flag false 나중에
      abortRef.current?.abort();
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, load, ...deps]);

  return { data, loading, error, reload: load };
}

/**
 * 파라미터 있는 fetcher 전용
 */
type UseApiWithParamsOptions<T, A> = UseApiOptions<T> & {
  serializeArgs?: (args: A) => string;
  deps?: DependencyList;
};

export function useApiWithParams<T, A>(
  fetcher: (args: A, signal?: AbortSignal) => Promise<T>,
  args: A,
  options: UseApiWithParamsOptions<T, A> = {}
) {
  const {
    initialData,
    enabled = true,
    serializeArgs = (v: A) => JSON.stringify(v),
    deps = [],
  } = options;

  const memoized = useMemo(
    () => (signal?: AbortSignal) => fetcher(args, signal),
    // args 직렬화 결과가 바뀔 때만 새로운 fetcher 생성
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetcher, serializeArgs(args)]
  );

  return useApi<T>(memoized, deps, { initialData, enabled });
}