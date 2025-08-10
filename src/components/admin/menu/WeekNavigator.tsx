'use client';

import { Dayjs } from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

type Props = {
  monday: Dayjs;                  // 주의 월요일
  selectedId: string;             // YYYY-MM-DD
  onSelect: (id: string) => void; // 하루 선택
  onShiftWeek: (deltaWeeks: number) => void; // -1: 이전주, +1: 다음주
};

const dayNames = ['월','화','수','목','금','토','일'];

export default function WeekNavigator({
  monday,
  selectedId,
  onSelect,
  onShiftWeek,
}: Props) {
  const days = Array.from({ length: 7 }).map((_, i) => monday.add(i, 'day'));

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
                onClick={() => onSelect(id)}
                className={clsx(
                  'flex flex-col items-center justify-center min-w-[44px] h-[56px] rounded-xl px-2 transition-colors',
                  isSelected
                    ? 'border-2 border-orange-400 text-orange-500 bg-orange-50'
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                )}
              >
                <span className={clsx(
                  'text-xs mb-0.5',
                  isSelected ? 'text-orange-500' : 'text-gray-500'
                )}>
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
          className=" rounded-lg hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}