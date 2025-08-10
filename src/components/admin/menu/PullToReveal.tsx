'use client';

import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = PropsWithChildren<{
  onReveal: () => void;
  threshold?: number;
  maxPull?: number;
  className?: string;
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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // ✅ EventListener로 선언하고 내부에서 TouchEvent로 캐스팅
    const onTouchStart: EventListener = (ev) => {
      const e = ev as TouchEvent;
      startYRef.current = e.touches[0].clientY;
      atTopRef.current = el.scrollTop <= 0;
      draggingRef.current = atTopRef.current;
    };

    const onTouchMove: EventListener = (ev) => {
      if (!draggingRef.current || startYRef.current == null) return;
      const e = ev as TouchEvent;
      const dy = e.touches[0].clientY - startYRef.current;
      if (dy > 0) {
        if (atTopRef.current) e.preventDefault(); // passive:false여야 동작
        setPullY(Math.min(maxPull, dy * 0.6));
      }
    };

    const onTouchEnd: EventListener = () => {
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
      // ✅ 같은 레퍼런스로 제거 (any 캐스팅 불필요)
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [onReveal, threshold, maxPull]);

  return (
    <div
      ref={scrollRef}
      className={`flex-1 min-h-0 overflow-y-auto ${className ?? ""}`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
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