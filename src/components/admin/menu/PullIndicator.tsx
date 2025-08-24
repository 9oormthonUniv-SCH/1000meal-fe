'use client';

import clsx from 'clsx';
import { Check, ChevronDown, Loader2 } from 'lucide-react';

export type PullPhase = 'idle' | 'pull' | 'ready' | 'loading';

type Props = {
  progress: number;         // 0 ~ 1
  phase: PullPhase;
  labelIdle?: string;
  labelPull?: string;
  labelReady?: string;
  labelLoading?: string;
};

export default function PullIndicator({
  progress,
  phase,
  labelIdle = '이전 주 메뉴 보기',
  labelPull = '이전 주 메뉴 보기',
  labelReady = '놓으면 이전 주가 추가됩니다',
  labelLoading = '이전 주 불러오는 중...',
}: Props) {
  const label = ((): string => {
    if (phase === 'ready') return labelReady;
    if (phase === 'loading') return labelLoading;
    if (phase === 'pull') return labelPull;
    return labelIdle;
  })();

  return (
    <div className="bg-white border-b px-4 py-3">
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        {phase === 'loading' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : phase === 'ready' ? (
          <Check className="w-4 h-4" />
        ) : (
          <ChevronDown
            className={clsx(
              'w-4 h-4 transition-transform',
              phase === 'pull' && progress > 0.7 ? 'rotate-180' : ''
            )}
          />
        )}
        <span>{label}</span>
      </div>

      {/* progress bar */}
      <div className="mt-2 h-1 bg-gray-100 rounded overflow-hidden">
        <div
          className={clsx(
            'h-1 rounded transition-[width]',
            phase === 'ready' ? 'bg-orange-400' : 'bg-orange-300'
          )}
          style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
        />
      </div>
    </div>
  );
}