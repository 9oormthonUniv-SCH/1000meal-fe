// components/admin/menu/PullToAddMenu.tsx
'use client';

import React, { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PullPhase } from './PullIndicator';

type Props = {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  rootId?: string;
  easeExp?: number; // 당김 감쇠
  renderIndicator: (ctx: { progress: number; phase: PullPhase }) => ReactNode;
};

export default function PullToAddMenu({
  children,
  onRefresh,
  rootId = 'app-main',
  easeExp = 1,
  renderIndicator,
}: Props) {
  // 당김 px
  const [pullY, setPullY] = useState(0);
  const pullYRef = useRef(0);
  useEffect(() => { pullYRef.current = pullY; }, [pullY]);

  // 단계
  const [phase, setPhase] = useState<PullPhase>('idle');

  // 헤더+액션바 높이
  const [offsetTop, setOffsetTop] = useState(0);

  // 인디케이터 실제 높이 측정
  const [indicatorH, setIndicatorH] = useState(80); // 기본값, 실제 측정으로 갱신
  const measureRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const header = document.getElementById('app-header');
    const bar = document.getElementById('action-bar');

    const calcTop = () =>
      (header?.getBoundingClientRect().height ?? 0) +
      (bar?.getBoundingClientRect().height ?? 0);

    const updateTop = () => setOffsetTop(calcTop());
    updateTop();

    const roTop = new ResizeObserver(updateTop);
    header && roTop.observe(header);
    bar && roTop.observe(bar);
    window.addEventListener('resize', updateTop);

    // 인디케이터 높이 측정
    const updateH = () => {
      const h = measureRef.current?.getBoundingClientRect().height ?? 0;
      if (h > 0) setIndicatorH(h);
    };
    updateH();
    const roH = new ResizeObserver(updateH);
    measureRef.current && roH.observe(measureRef.current);

    return () => {
      roTop.disconnect();
      roH.disconnect();
      window.removeEventListener('resize', updateTop);
    };
  }, []);

  // 제스처 스냅샷
  const startYRef = useRef(0);
  const isTouchRef = useRef(false);
  const pulledRef = useRef(false);
  const readyRef = useRef(false);

  const rafRef = useRef<number | null>(null);
  const setPullRaf = (v: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setPullY(v));
  };

  // 스크롤 최상단?
  const atTop = () => {
    const root = document.getElementById(rootId);
    return !!root && root.scrollTop <= 0;
  };

  // 문서 터치 이동 중 스크롤 차단
  useEffect(() => {
    const onDocTouchMove = (e: TouchEvent) => {
      if (isTouchRef.current && pulledRef.current && e.cancelable) e.preventDefault();
    };
    document.addEventListener('touchmove', onDocTouchMove, { passive: false });
    return () => document.removeEventListener('touchmove', onDocTouchMove);
  }, []);

  const reset = () => {
    pulledRef.current = false;
    readyRef.current = false;
    setPhase('idle');
    setPullRaf(0);
    document.body.style.overflow = '';
  };

  const onStart = (y: number, isTouch: boolean) => {
    if (!atTop()) return;
    isTouchRef.current = isTouch;
    pulledRef.current = true;
    readyRef.current = false;
    startYRef.current = y;
    setPhase('pull');
    document.body.style.overflow = 'hidden';
  };

  const onMove = (y: number) => {
    if (!pulledRef.current) return;
    const dy = y - startYRef.current;
    if (dy <= 0) { reset(); return; }

    // 헤더+액션바 구간 포함해 늘어나게 하고, 과도한 당김은 완만하게
    const derivedMax = offsetTop + indicatorH + 60; // 여유 60px
    const eased = Math.min(derivedMax, Math.pow(dy, easeExp));
    setPullRaf(eased);

    const rawPull = Math.max(0, eased - offsetTop);
    const visible = Math.min(rawPull, indicatorH); // 실제로 화면에 드러난 높이
    const isReady = visible >= indicatorH;         // 전부 드러났을 때 ready
    readyRef.current = isReady;
    setPhase(isReady ? 'ready' : 'pull');
  };

  const onEnd = async () => {
    if (!pulledRef.current) return;
    document.body.style.overflow = '';
    if (readyRef.current) {
      setPhase('loading');
      try {
        await onRefresh();
      } finally {
        reset();
      }
    } else {
      reset();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => onStart(e.touches[0].clientY, true);
  const handleTouchMove  = (e: React.TouchEvent) => onMove(e.touches[0].clientY);
  const handleTouchEnd   = () => onEnd();

  const handleMouseDown  = (e: React.MouseEvent) => onStart(e.clientY, false);
  const handleMouseMove  = (e: React.MouseEvent) => { if (!isTouchRef.current) onMove(e.clientY); };
  const handleMouseUp    = () => { if (!isTouchRef.current) onEnd(); };

  // 화면에 보이는 높이/진행률
  const rawPull  = Math.max(0, pullY - offsetTop);
  const visible  = Math.min(rawPull, indicatorH);
  const progress = indicatorH > 0 ? Math.max(0, Math.min(1, visible / indicatorH)) : 0;

  return (
    <div className="relative w-full">
      {/* (0) 인디케이터 실제 높이 측정용 히든 노드 */}
      <div ref={measureRef} className="absolute -top-[9999px] left-0 invisible" aria-hidden>
        {renderIndicator({ progress: 1, phase: 'pull' })}
      </div>

      {/* (1) 레이아웃을 실제로 미는 스페이서 */}
      <div className="sticky top-0 z-20 bg-transparent">
        <div className="overflow-hidden" style={{ height: `${visible}px` }}>
          {/* (2) 인디케이터 내용: 위에서 아래로 슬라이드 */}
          <div style={{ transform: `translateY(${visible - indicatorH}px)` }}>
            {phase === 'loading'
              ? renderIndicator({ progress: 1, phase: 'loading' })
              : renderIndicator({ progress, phase })}
          </div>
        </div>
      </div>

      {/* (3) 제스처 영역 */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {children}
      </div>
    </div>
  );
}