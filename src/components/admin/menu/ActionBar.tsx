// components/admin/menu/ActionBar.tsx
'use client';

type Props = { onClickFavorite?: () => void };

export default function ActionBar({ onClickFavorite }: Props) {
  return (
    <div
      id="action-bar"
      className="relative z-30 shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b"
    >
      <div className="text-sm text-gray-600 inline-flex items-center gap-2">
        <span className="i-lucide-menu h-4 w-4" />
        이전 날짜 보기
      </div>
      <button
        onClick={onClickFavorite}
        className="text-xs px-3 py-1 rounded-full bg-orange-500 text-white shadow-sm"
      >
        자주 쓰는 메뉴관리
      </button>
    </div>
  );
}