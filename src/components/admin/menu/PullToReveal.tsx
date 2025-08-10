'use client';

import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * 스크롤 컨테이너 + 상단으로 당기면 onReveal 호출
 * - 부모는 반드시 flex column이며, 이 컴포넌트에 `flex-1 min-h-0`을 주세요
 */
type Props = PropsWithChildren<{
  onReveal: () => void;                // 임계치 넘기고 손 떼면 호출
  threshold?: number;                   // 기본 90
  maxPull?: number;                     // 기본 140
  className?: string;                   // 내부 스크롤 영역 클래스
}>;

export default function PullToReveal({
  onReveal,
  threshold = 90,
  maxPull = 140,
  className,
  children,
}: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const atTopRef = useRef(false);

  const [pullY, setPullY] = useState(0);
  const pullYRef = useRef(0);
  useEffect(() => { pullYRef.current = pullY; }, [pullY]);

  // 네이티브 PTR 차단 + 제스처 처리
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      startYRef.current = e.touches[0].clientY;
      atTopRef.current = el.scrollTop <= 0;
      draggingRef.current = atTopRef.current;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!draggingRef.current || startYRef.current == null) return;
      const dy = e.touches[0].clientY - startYRef.current;
      if (dy > 0) {
        if (atTopRef.current) e.preventDefault(); // passive:false 필수
        setPullY(Math.min(maxPull, dy * 0.6));
      }
    };

    const onTouchEnd = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      startYRef.current = null;

      if (pullYRef.current >= threshold) onReveal();
      setPullY(0);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart as any);
      el.removeEventListener("touchmove", onTouchMove as any);
      el.removeEventListener("touchend", onTouchEnd as any);
    };
  }, [onReveal, threshold, maxPull]);

  return (
    <div
      ref={scrollRef}
      className={`flex-1 min-h-0 overflow-y-auto ${className ?? ""}`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* 풀다운 인디케이터 */}
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
                className="h-1 bg-gray-300 rounded"
                style={{ width: `${Math.min(100, (pullY / threshold) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {children}
    </div>
  );
}