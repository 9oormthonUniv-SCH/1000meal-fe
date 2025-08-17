// src/lib/hooks/useApi.ts
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

  const load = useCallback(async () => {
    // 이전 요청 취소
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetcher(controller.signal);
      setData(res);
    } catch (err: unknown) {
      // abort는 에러로 간주하지 않음
      if (err instanceof DOMException && err.name === 'AbortError') return;

      const message =
        err instanceof Error ? err.message : '요청에 실패했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (!enabled) return;
    void load();
    return () => abortRef.current?.abort();
    // deps는 바깥에서 주입받아 추적
  }, [enabled, load, ...deps]);

  return { data, loading, error, reload: load };
}

/**
 * 파라미터 있는 fetcher 전용
 * - fetcher: (args, signal?) => Promise<T>
 * - args 변화에 따라 자동 재요청
 */
type UseApiWithParamsOptions<T, A> = UseApiOptions<T> & {
  /** args 변경 비교용 커스텀 직렬화 함수 (기본: JSON.stringify) */
  serializeArgs?: (args: A) => string;
  /** 추가 의존성 (args 외) */
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

  // args를 캡쳐한 fetcher 생성
  const memoized = useMemo(
    () => (signal?: AbortSignal) => fetcher(args, signal),
    // fetcher 참조와 args 키가 변할 때만 갱신
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetcher, serializeArgs(args)]
  );

  return useApi<T>(memoized, deps, { initialData, enabled });
}