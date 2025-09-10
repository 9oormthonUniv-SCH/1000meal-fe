'use client';

import clsx from 'clsx';
import dayjs from 'dayjs';
import { ChevronRight } from 'lucide-react';

export type DayMenu = {
  id: string;
  dateLabel: string;
  weekdayLabel: string;
  items: string[];
  stock?: number;
};

type Props = {
  week: DayMenu[];
  onRemove?: () => void;
  onAddWeekend?: () => void;
  readOnly?: boolean;
  onClickDay?: (id: string) => void;   // ✅ 새로 추가
};

export default function MenuWeekEditor({
  week,
  readOnly = false,
  onClickDay,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-4">

      <ul>
        {week.map(d => (
          <li
            key={d.id}
            className={clsx(
              "grid grid-cols-[72px_56px_1fr_20px] items-center gap-2 px-4 py-3 border-b last:border-b-0",
              dayjs(d.id).isBefore(dayjs(), "day") && "opacity-40"
            )}
          >
            <span
              className={clsx(
                "text-sm border-r",
                d.id === dayjs().format("YYYY-MM-DD") ? "text-orange-500 font-semibold" : "text-gray-500"
              )}
            >
              {d.dateLabel}
            </span>
            <span className="text-gray-500 text-sm">{d.weekdayLabel}</span>
            <button
              onClick={() => !readOnly && onClickDay?.(d.id)}
              className={clsx(
                'min-w-0 w-full text-left truncate text-sm',
                readOnly ? 'cursor-default' : 'hover:opacity-90',
                d.items.length ? 'text-gray-800' : 'text-gray-400'
              )}
              disabled={readOnly}
            >
              {d.items.length ? d.items.join(', ') : '메뉴 없음'}
            </button>
            <ChevronRight className={clsx('w-4 h-4 justify-self-end', readOnly ? 'text-gray-300' : 'text-gray-400')} />
          </li>
        ))}
      </ul>
    </div>
  );
}