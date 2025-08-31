'use client';

import clsx from 'clsx';
import { Dayjs } from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  monday: Dayjs;                  // 주의 월요일
  selectedId: string;             // YYYY-MM-DD
  onShiftWeek: (deltaWeeks: number) => void; // -1: 이전주, +1: 다음주
  onSelectDate: (id: string) => void;
};

const dayNames = ['월','화','수','목','금','토','일'];

export default function WeekNavigator({
  monday,
  selectedId,
  onShiftWeek,
  onSelectDate,
}: Props) {
  const days = Array.from({ length: 7 }).map((_, i) =>
    monday.clone().add(i, "day")
  );

  return (
    <div className="px-3 py-2 bg-white border-b">
      <div className="flex items-center">
        {/* 이전 주 */}
        <button
          aria-label="이전 주"
          onClick={() => onShiftWeek(-1)}
          className="rounded-lg hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* 요일/날짜 pills */}
        <div className="flex-1 flex items-center justify-between overflow-x-auto no-scrollbar">
          {days.map((d, idx) => {
            const id = d.format('YYYY-MM-DD');
            const isSelected = id === selectedId;
            return (
              <button
                key={id}
                onClick={() => onSelectDate(id)} // ✅ 이동
                className={clsx(
                  'flex flex-col items-center justify-center min-w-[44px] h-[56px] rounded-xl px-2 transition-colors',
                  isSelected
                    ? 'border border-orange-400'
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                )}
              >
                <span className='text-xs mb-0.5 text-gray-500'>
                  {dayNames[idx]}
                </span>
                <span className="text-base font-semibold">
                  {d.date()}
                </span>
              </button>
            );
          })}
        </div>

        {/* 다음 주 */}
        <button
          aria-label="다음 주"
          onClick={() => onShiftWeek(1)}
          className="rounded-lg hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}