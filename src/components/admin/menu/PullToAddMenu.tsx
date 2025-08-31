'use client';

import React, { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PullPhase } from './PullIndicator';

type Props = {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  onReachEnd?: () => Promise<void> | void; // ✅ 아래 도달 이벤트
  rootId?: string;
  easeExp?: number; // 당김 감쇠
  renderIndicator: (ctx: { progress: number; phase: PullPhase }) => ReactNode;
};

export default function PullToAddMenu({
  children,
  onRefresh,
  onReachEnd,
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

  // ✅ 하단 센티널 ref
  const endRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const header = document.getElementById('app-header');
    const bar = document.getElementById('action-bar');

    const calcTop = () =>
      (header?.getBoundingClientRect().height ?? 0) +
      (bar?.getBoundingClientRect().height ?? 0);

    const updateTop = () => setOffsetTop(calcTop());
    updateTop();

    const roTop = new ResizeObserver(updateTop);
    if (header) roTop.observe(header);
    if (bar) roTop.observe(bar);
    window.addEventListener('resize', updateTop);

    const updateH = () => {
      const h = measureRef.current?.getBoundingClientRect().height ?? 0;
      if (h > 0) setIndicatorH(h);
    };
    updateH();
    const roH = new ResizeObserver(updateH);
    if (measureRef.current) roH.observe(measureRef.current);

    return () => {
      roTop.disconnect();
      roH.disconnect();
      window.removeEventListener('resize', updateTop);
    };
  }, []);

  // ✅ 하단 감지 (무한 스크롤)
  useEffect(() => {
    if (!onReachEnd || !endRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onReachEnd();
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(endRef.current);
    return () => observer.disconnect();
  }, [onReachEnd]);

  // pull-to-refresh 로직 (생략 부분은 그대로)
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

      {/* 당김 인디케이터 */}
      <div className="sticky top-0 z-20 bg-transparent">
        <div className="overflow-hidden" style={{ height: `${visible}px` }}>
          <div style={{ transform: `translateY(${visible - indicatorH}px)` }}>
            {phase === 'loading'
              ? renderIndicator({ progress: 1, phase: 'loading' })
              : renderIndicator({ progress, phase })}
          </div>
        </div>
      </div>

      {/* 제스처 + 컨텐츠 */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {children}
        {/* ✅ 무한 스크롤 센티널 */}
        {onReachEnd && <div ref={endRef} className="h-1" />}
      </div>
    </div>
  );
}