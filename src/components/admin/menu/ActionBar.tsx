// components/admin/menu/ActionBar.tsx
'use client';

import { Calendar } from 'lucide-react';

type Props = { onClickCalendar?: () => void; onClickFavorite?: () => void };

export default function ActionBar({ onClickCalendar, onClickFavorite }: Props) {
  return (
    <div
      id="action-bar"
      className="relative z-30 shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b"
    >
      <button
        onClick={onClickCalendar}
        className="text-sm text-gray-600 inline-flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        다른 주 보기
      </button>

      <button
        onClick={onClickFavorite}
        className="text-xs px-3 py-1 rounded-full bg-orange-500 text-white shadow-sm"
      >
        자주 쓰는 메뉴
      </button>
    </div>
  );
}