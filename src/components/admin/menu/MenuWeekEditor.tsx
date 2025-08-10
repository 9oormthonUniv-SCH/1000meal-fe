// components/admin/menu/MenuWeekEditor.tsx
'use client';

import { ChevronRight, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

export type DayMenu = {
  id: string;          // YYYY-MM-DD
  dateLabel: string;   // MM.DD
  weekdayLabel: string;// 월, 화, ...
  items: string[];
};

type Props = {
  title?: string;
  week: DayMenu[];
  onChange?: (next: DayMenu[]) => void; // (지금은 사용 X, 추후 확장용)
  onRemove?: () => void;
  onAddWeekend?: () => void;
  readOnly?: boolean; // 읽기 전용 모드
};

export default function MenuWeekEditor({
  title,
  week,
  onRemove,
  onAddWeekend,
  readOnly = false,
}: Props) {
  const router = useRouter();

  const goDetail = (id: string) => {
    if (readOnly) return;
    router.push(`/admin/menu/${id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-4">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-800">{title}</div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            <button
              onClick={onAddWeekend}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              주말 추가하기
            </button>
            {onRemove && (
              <button
                onClick={onRemove}
                className="p-2 rounded-lg hover:bg-red-50"
                aria-label="주간 세트 삭제"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
        )}
      </div>

      <ul>
        {week.map((d) => (
          <li
            key={d.id}
            className="grid grid-cols-[72px_56px_1fr_20px] items-center gap-2 px-4 py-3 border-b last:border-b-0"
          >
            <span className="text-gray-500 text-sm">{d.dateLabel}</span>
            <span className="text-gray-500 text-sm">{d.weekdayLabel}</span>

            <button
              onClick={() => goDetail(d.id)}
              className={clsx(
                'min-w-0 w-full text-left truncate text-sm',
                readOnly ? 'cursor-default' : 'hover:opacity-90',
                d.items.length ? 'text-gray-800' : 'text-gray-400'
              )}
              disabled={readOnly}
            >
              {d.items.length ? d.items.join(', ') : '메뉴 없음'}
            </button>

            <ChevronRight className={clsx(
              'w-4 h-4 justify-self-end',
              readOnly ? 'text-gray-300' : 'text-gray-400'
            )} />
          </li>
        ))}
      </ul>
    </div>
  );
}