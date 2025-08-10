'use client';

import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = PropsWithChildren<{
  onReveal: () => void;
  threshold?: number;     // 풀다운 완료 임계치
  maxPull?: number;       // 최대 당김
  className?: string;
  fillStart?: number;     // 프로그레스바가 차기 시작하는 지점
}>;

export default function PullToReveal({
  onReveal,
  threshold = 120,
  maxPull = 120,
  className,
  children,
  fillStart = 60,
}: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef<number | null>(null);

  const draggingRef = useRef(false);          // 실제 풀다운 제스처가 시작됐는지
  const reachedTopOnceRef = useRef(false);    // 이동 중 최상단을 실제로 “한번이라도” 찍었는지
  const dySinceTopRef = useRef(0);            // 최상단을 찍은 뒤부터의 누적 drag

  const [pullY, setPullY] = useState(0);
  const pullYRef = useRef(0);
  useEffect(() => { pullYRef.current = pullY; }, [pullY]);

  const EPS = 1;                 // scrollTop 허용 오차
  const START_AFTER = 12;        // 최상단 찍고 최소 몇 px 당겨야 풀다운 시작할지

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onTouchStart: EventListener = (ev) => {
      const e = ev as TouchEvent;
      startYRef.current = e.touches[0].clientY;
      draggingRef.current = false;        // 매 제스처마다 초기화
      reachedTopOnceRef.current = el.scrollTop <= EPS;
      dySinceTopRef.current = 0;
    };

    const onTouchMove: EventListener = (ev) => {
      if (startYRef.current == null) return;
      const e = ev as TouchEvent;

      const dy = e.touches[0].clientY - startYRef.current;

      // 스크롤이 위로 진행되며 한번이라도 최상단(≈0)을 찍으면 플래그 ON
      if (el.scrollTop <= EPS) {
        reachedTopOnceRef.current = true;
      }

      // 아직 풀다운 시작 전: 최상단을 찍고, 그 뒤로 START_AFTER 이상 당겼을 때만 시작
      if (!draggingRef.current) {
        if (reachedTopOnceRef.current && dy > 0) {
          dySinceTopRef.current = dy; // 최상단 이후 거리 추적
          if (dySinceTopRef.current >= START_AFTER) {
            draggingRef.current = true;
          }
        }
      }

      // 풀다운 중일 때만 기본 PTR을 막고, 거리 반영
      if (draggingRef.current) {
        if ((e as any).cancelable) e.preventDefault(); // passive:false에서만 가능
        const eased = Math.min(maxPull, (dy - START_AFTER) * 0.6);
        setPullY(Math.max(0, eased));
      }
    };

    const onTouchEnd: EventListener = () => {
      if (draggingRef.current && pullYRef.current >= threshold) {
        onReveal();
      }
      // 리셋
      draggingRef.current = false;
      reachedTopOnceRef.current = false;
      dySinceTopRef.current = 0;
      startYRef.current = null;
      setPullY(0);
    };

    // 중요: touchmove 는 passive:false 여야 preventDefault가 동작
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [onReveal, threshold, maxPull]);

  // 프로그레스바: fillStart 이후부터 차오르게
  const clamped = Math.max(0, pullY - fillStart);
  const denom = Math.max(1, threshold - fillStart);
  const progress = Math.min(1, clamped / denom);

  return (
    <div
      ref={scrollRef}
      className={`flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y ${className ?? ""}`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* 인디케이터 */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: pullY }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="overflow-hidden"
      >
        {pullY > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border px-4 py-3 mx-4 mt-4 text-center text-sm text-gray-500">
            {pullY >= threshold ? "놓으면 이전 주가 추가됩니다" : "이전 주 메뉴 보기"}
            <div className="mt-2 h-1 bg-gray-100 rounded">
              <div
                className="h-1 bg-orange-300 rounded transition-[width] duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {children}
    </div>
  );
}