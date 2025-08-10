'use client';

import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Props = PropsWithChildren<{
  onReveal: () => void;     // 임계치 넘긴 뒤 손 떼면 호출
  threshold?: number;       // 기본 90
  maxPull?: number;         // 기본 140
  className?: string;       // 스크롤 영역에 추가 클래스
}>;

export default function PullToReveal({
  onReveal,
  threshold = 30,
  maxPull = 90,
  className,
  children,
}: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 제스처 상태
  const startYRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const atTopRef = useRef(false);

  // 풀다운 거리 (UI)
  const [pullY, setPullY] = useState(0);
  const pullYRef = useRef(0);
  useEffect(() => {
    pullYRef.current = pullY;
  }, [pullY]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      startYRef.current = e.touches[0].clientY;
      atTopRef.current = el.scrollTop <= 0;     // 최상단에서만 제스처 시작
      draggingRef.current = atTopRef.current;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!draggingRef.current || startYRef.current == null) return;
      const dy = e.touches[0].clientY - startYRef.current;

      // 아래로 끌 때만 처리
      if (dy > 0) {
        // iOS 기본 PTR 방지: cancelable + 최상단일 때만 막기
        if (atTopRef.current && e.cancelable) {
          e.preventDefault(); // 반드시 touchmove 리스너를 passive:false로 등록해야 함
        }
        const eased = Math.min(maxPull, dy * 0.6);
        setPullY(eased);
      }
    };

    const onTouchEnd = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      startYRef.current = null;

      // 임계치 넘겼으면 콜백 실행
      if (pullYRef.current >= threshold) onReveal();
      setPullY(0);
    };

    // passive 옵션 주의!
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [onReveal, threshold, maxPull]);

  return (
    <div
      ref={scrollRef}
      className={`flex-1 min-h-0 overflow-y-auto ${className ?? ''}`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* 풀다운 인디케이터 */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: pullY }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="overflow-hidden"
      >
        {pullY > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border px-4 py-3 mx-4 mt-4 text-center text-sm text-gray-500">
            {pullY >= threshold ? '놓으면 이전 주가 추가됩니다' : '이전 주 메뉴 보기'}
            <div className="mt-2 h-1 bg-gray-100 rounded">
              <div
                className="h-1 bg-orange-300 rounded transition-[width]"
                style={{
                  // 예: 30px 넘긴 뒤부터 차기 시작 (시작 오프셋)
                  width: `${Math.max(0, Math.min(100, ((pullY - 60) / threshold) * 100))}%`,
                }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {children}
    </div>
  );
}