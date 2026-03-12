'use client';

export type PullPhase = 'idle' | 'pull' | 'ready' | 'loading';

type Props = {
  progress: number;
  phase: PullPhase;
  labelIdle?: string;
  labelPull?: string;
  labelReady?: string;
  labelLoading?: string;
};

const R = 14;
const C = 2 * Math.PI * R;

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

  // 당길 때: 빈 원 → 진행도에 따라 호가 채워짐
  const strokeDashoffset = phase === 'loading' ? 0 : C * (1 - Math.max(0, Math.min(1, progress)));

  return (
    <div className="px-4 flex flex-col items-center justify-center gap-3">
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg
          className="w-8 h-8 -rotate-90"
          viewBox={`0 0 ${R * 2 + 4} ${R * 2 + 4}`}
          style={{ overflow: 'visible' }}
        >
          {/* 배경 링 (연한 회색) */}
          <circle
            cx={R + 2}
            cy={R + 2}
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-200"
          />
          {/* 진행 링 / 버퍼링 링 */}
          <circle
            cx={R + 2}
            cy={R + 2}
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={strokeDashoffset}
            className="text-orange-400 transition-[stroke-dashoffset] duration-150"
            style={
              phase === 'loading'
                ? {
                    strokeDasharray: `${C * 0.25} ${C * 0.75}`,
                    strokeDashoffset: 0,
                    animation: 'pullIndicatorSpin 0.8s linear infinite',
                  }
                : undefined
            }
          />
        </svg>
      </div>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}
