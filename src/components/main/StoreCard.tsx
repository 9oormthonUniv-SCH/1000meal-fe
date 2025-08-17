'use client';

import { StoreListItem } from "@/types/store";
import { useRouter } from 'next/navigation';
import clsx from 'clsx'; // 조건부 class를 쉽게 쓰기 위해 사용

interface Props {
  store: StoreListItem;
  isSelected?: boolean; // ✅ 외부에서 강조 여부 받음
  onClick?: () => void; // ✅ 클릭 이벤트 외부 전달
}

export default function StoreCard({ store, isSelected, onClick }: Props) {
  const router = useRouter();
  const handleClick = () => {
    onClick?.(); // 외부에 클릭 알림
    router.push(`/store/${store.id}`);
  };

  const menusText =
    Array.isArray(store.todayMenu?.menus) && store.todayMenu.menus.length > 0
      ? store.todayMenu.menus.join(', ')
      : store.open
        ? '메뉴 정보 없음'
        : '오늘 휴무';

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "flex items-center justify-between gap-4 p-4 mb-4 rounded-2xl shadow-even cursor-pointer transition-all duration-200 border",
        isSelected ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-white"
      )}
    >
      {/* 좌측: 이미지 자리 */}
      <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0" />

      {/* 중앙: 텍스트 정보 */}
      <div className="flex-1">
        <h2 className="text-base font-semibold">{store.name}</h2>
        <p className="text-sm text-gray-600">{menusText}</p>
      </div>

      {/* 우측: 수량 표시 */}
      <div className="text-right">
        <div className={clsx(
          "text-base font-bold",
          store.remain === 0 ? "text-red-500" : "text-orange-500"
        )}>
          {store.remain}개
        </div>
        <div className="text-sm text-gray-500">남았어요!</div>
      </div>
    </div>
  );
}