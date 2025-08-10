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
  
    const ACTIVATE_AFTER = 12; // 데드존(px)
  
    let startY = 0;
    let pulling = false; // 풀다운 활성화 여부
  
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      pulling = false; // 매 제스처 초기화
    };
  
    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - startY;
  
      // 아직 풀다운 시작 전
      if (!pulling) {
        // 내용이 스크롤 중이면(>0) 그냥 통과
        if (el.scrollTop > 0) return;
  
        // 최상단 + 충분히 아래로 당긴 경우에만 풀다운 활성화
        if (dy > ACTIVATE_AFTER && el.scrollTop <= 0) {
          pulling = true;
        } else {
          return; // 데드존 이전에는 아무것도 안 함(스크롤 방해 X)
        }
      }
  
      // 여기부터 풀다운 상태
      if (dy <= 0) {
        // 다시 위로 밀면(또는 손을 올리면) 풀다운 취소
        pulling = false;
        setPullY(0);
        return;
      }
  
      // 네이티브 PTR 방지: 풀다운 중일 때만 preventDefault
      if (e.cancelable) e.preventDefault();
  
      const eased = Math.min(maxPull, dy * 0.6);
      setPullY(eased);
    };
  
    const onTouchEnd = () => {
      if (!pulling) return;
      pulling = false;
  
      if (pullYRef.current >= threshold) onReveal();
      setPullY(0);
    };
  
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