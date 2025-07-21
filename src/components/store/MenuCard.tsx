'use client';

import clsx from 'clsx';

interface MenuCardProps {
  date: string;
  day: string;
  items: string[];
  selected?: boolean;
}

export default function MenuCard({ date, day, items, selected = false }: MenuCardProps) {
  return (
    <div
      className={clsx(
        "p-3 rounded-xl text-center w-full transition-all duration-200 shadow-md",
        selected
          ? "border border-orange-500"
          : "border border-gray-200"
      )}
    >
      {/* 날짜와 요일 */}
      <div className="flex justify-between items-center text-sm font-semibold mb-1">
        <span className={clsx(selected ? "text-orange-500" : "text-gray-800")}>{date}</span>
        <span className={clsx("text-sm", selected ? "text-orange-400" : "text-gray-400")}>{day}</span>
      </div>

      {/* 구분선 */}
      <div className={clsx("h-px mb-3", selected ? "bg-orange-200" : "bg-gray-200")} />

      {/* 메뉴 목록 */}
      <div className="flex flex-col gap-3 text-sm text-gray-700">
        {items.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  );
}