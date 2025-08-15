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
  const [pullY, setPullY] = useState(0);
  const pullYRef = useRef(0);
  useEffect(() => { pullYRef.current = pullY; }, [pullY]);

  const [phase, setPhase] = useState<PullPhase>('idle');

  const [offsetTop, setOffsetTop] = useState(0);

  const [indicatorH, setIndicatorH] = useState(80);
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
    if (header) roTop.observe(header);            // ✅ if 문으로 변경
    if (bar) roTop.observe(bar);                  // ✅ if 문으로 변경
    window.addEventListener('resize', updateTop);

    // 인디케이터 높이 측정
    const updateH = () => {
      const h = measureRef.current?.getBoundingClientRect().height ?? 0;
      if (h > 0) setIndicatorH(h);
    };
    updateH();
    const roH = new ResizeObserver(updateH);
    if (measureRef.current) roH.observe(measureRef.current); // ✅ if 문으로 변경

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

  const atTop = () => {
    const root = document.getElementById(rootId);
    return !!root && root.scrollTop <= 0;
  };

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

    const derivedMax = offsetTop + indicatorH + 60;
    const eased = Math.min(derivedMax, Math.pow(dy, easeExp));
    setPullRaf(eased);

    const rawPull = Math.max(0, eased - offsetTop);
    const visible = Math.min(rawPull, indicatorH);
    const isReady = visible >= indicatorH;
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

  const rawPull  = Math.max(0, pullY - offsetTop);
  const visible  = Math.min(rawPull, indicatorH);
  const progress = indicatorH > 0 ? Math.max(0, Math.min(1, visible / indicatorH)) : 0;

  return (
    <div className="relative w-full">
      {/* 높이 측정용 히든 노드 */}
      <div ref={measureRef} className="absolute -top-[9999px] left-0 invisible" aria-hidden>
        {renderIndicator({ progress: 1, phase: 'pull' })}
      </div>

      {/* 레이아웃을 실제로 미는 스페이서 */}
      <div className="sticky top-0 z-20 bg-transparent">
        <div className="overflow-hidden" style={{ height: `${visible}px` }}>
          {/* 인디케이터 내용: 위에서 아래로 슬라이드 */}
          <div style={{ transform: `translateY(${visible - indicatorH}px)` }}>
            {phase === 'loading'
              ? renderIndicator({ progress: 1, phase: 'loading' })
              : renderIndicator({ progress, phase })}
          </div>
        </div>
      </div>

      {/* 제스처 영역 */}
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