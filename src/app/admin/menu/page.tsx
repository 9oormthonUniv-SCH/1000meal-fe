'use client';

import { useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';
import Header from '@/components/common/Header';
import { Plus } from 'lucide-react';
import MenuWeekEditor, { DayMenu } from '@/components/admin/menu/MenuWeekEditor';
import { motion } from 'framer-motion';

dayjs.locale('ko');

function mondayOf(d: Dayjs) {
  const weekday = d.day(); // 0~6
  const diff = (weekday + 6) % 7;
  return d.subtract(diff, 'day').startOf('day');
}
function buildWeek(base: Dayjs): DayMenu[] {
  const start = mondayOf(base);
  return Array.from({ length: 5 }).map((_, i) => {
    const dt = start.add(i, 'day');
    return {
      id: dt.format('YYYY-MM-DD'),
      dateLabel: dt.format('MM.DD'),
      weekdayLabel: dt.format('dd'),
      items: [], // TODO: API로 채우기
    };
  });
}

export default function AdminMenuPage() {
  // 편집 중인 주(현재·미래 등)
  const [weeks, setWeeks] = useState<DayMenu[][]>([]);
  const addCurrentWeek = () => setWeeks(prev => [buildWeek(dayjs()), ...prev]);
  const updateWeek = (i: number, next: DayMenu[]) =>
    setWeeks(prev => prev.map((w, idx) => (idx === i ? next : w)));
  const removeWeek = (i: number) => setWeeks(prev => prev.filter((_, idx) => idx !== i));

  // ▼ 과거 주차 스택
  const [pastWeeks, setPastWeeks] = useState<DayMenu[][]>([]);
  const prependPastWeek = () => {
    // 맨 앞 주차의 월요일을 기준으로 더 이전 주 생성
    const baseMonday = pastWeeks.length
      ? mondayOf(dayjs(pastWeeks[0][0].id)).subtract(7, 'day')
      : mondayOf(dayjs()).subtract(7, 'day');
    const newWeek = buildWeek(baseMonday).map(d => ({
      ...d,
      // 데모용 더미 데이터
      items: ['김치볶음밥', '계란후라이'].slice(0),
    }));
    setPastWeeks(prev => [newWeek, ...prev]);
  };

  // ▼ pull-to-reveal 상태
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const [pullY, setPullY] = useState(0);
  const THRESHOLD = 90;
  const MAX_PULL = 140;

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!scrollRef.current) return;
    if (scrollRef.current.scrollTop <= 0) {
      draggingRef.current = true;
      startYRef.current = e.touches[0].clientY;
    }
  };
  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!draggingRef.current || startYRef.current == null) return;
    const dy = e.touches[0].clientY - startYRef.current;
    if (dy > 0) {
      const eased = Math.min(MAX_PULL, dy * 0.6);
      setPullY(eased);
      e.preventDefault();
    }
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    startYRef.current = null;

    if (pullY >= THRESHOLD) {
      prependPastWeek(); // ✅ 매번 한 주 추가
    }
    setPullY(0);
  };

  return (
    <div className="w-full min-h-dvh bg-[#F5F6F7]">
      <Header title="메뉴 관리" />

      {/* 상단 액션 영역 (텍스트만 남김) */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <div className="text-sm text-gray-600 inline-flex items-center gap-2">
          <span className="i-lucide-menu h-4 w-4" />
          이전 날짜 보기
        </div>
        <button
          onClick={() => {/* 라우팅 자리 */}}
          className="text-xs px-3 py-1 rounded-full bg-orange-500 text-white shadow-sm"
        >
          자주 쓰는 메뉴관리
        </button>
      </div>

      {/* 스크롤 영역 */}
      <div
        ref={scrollRef}
        className="px-4 pb-16 space-y-6 overflow-y-auto"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
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
            <div className="bg-white rounded-2xl shadow-sm border px-4 py-3 text-center text-sm text-gray-500">
              {pullY >= THRESHOLD ? '놓으면 이전 주가 추가됩니다' : '이전 주 메뉴 보기'}
              <div className="mt-2 h-1 bg-gray-100 rounded">
                <div
                  className="h-1 bg-gray-300 rounded"
                  style={{ width: `${Math.min(100, (pullY / THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* ✅ 과거 주차 스택 (읽기 전용 카드들이 위에서부터 쌓임) */}
        {pastWeeks.map((week, idx) => (
          <MenuWeekEditor
            key={`past-${week[0]?.id ?? idx}`}
            title={`지난 주 ${idx + 1}`}
            week={week}
            readOnly
          />
        ))}

        {/* 비어있으면 + 버튼 */}
        {weeks.length === 0 && (
          <div className="pt-6 flex justify-center">
            <button
              onClick={addCurrentWeek}
              className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shadow"
              aria-label="주간 메뉴 추가"
            >
              <Plus className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        )}

        {/* 편집 카드들 */}
        {weeks.map((week, idx) => (
          <MenuWeekEditor
            key={week[0]?.id ?? idx}
            title={idx === 0 ? '이번 주' : `주간 세트 ${weeks.length - idx}`}
            week={week}
            onChange={(next) => updateWeek(idx, next)}
            onRemove={() => removeWeek(idx)}
            onAddWeekend={() => {/* 주말 행 추가 자리 */}}
          />
        ))}

        {/* 추가 + 버튼 */}
        {weeks.length > 0 && (
          <div className="py-2 flex justify-center">
            <button
              onClick={addCurrentWeek}
              className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shadow"
              aria-label="주간 메뉴 추가"
            >
              <Plus className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}