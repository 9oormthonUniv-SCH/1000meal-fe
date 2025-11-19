'use client';

import { StoreListItem } from "@/types/store";
import { normalizeImageUrl } from "@/lib/utils/imageUrl";
import clsx from 'clsx';
import Image from "next/image";
import { useRouter } from 'next/navigation';

interface Props {
  store: StoreListItem;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function StoreCard({ store, isSelected, onClick }: Props) {
  const router = useRouter();
  const handleClick = () => {
    onClick?.();
    router.push(`/store/${store.id}`);
  };

  const menusText =
    Array.isArray(store.todayMenu?.menus) && store.todayMenu.menus.length > 0
      ? store.todayMenu.menus.join(', ')
      : '메뉴 정보 없음';

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "flex items-center justify-between gap-4 p-4 mb-4 rounded-2xl shadow-even cursor-pointer transition-all duration-200 border",
        isSelected ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-white"
      )}
    >
      {/* 좌측: 매장 이미지 */}
      {(() => {
        const normalizedImageUrl = normalizeImageUrl(store.imageUrl);
        return normalizedImageUrl ? (
          <Image
            src={normalizedImageUrl}
            alt={store.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-lg object-contain flex-shrink-0"
          />
        ) : (
        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
          No Img
        </div>
        );
      })()}

      {/* 중앙: 텍스트 정보 */}
      <div className="flex-1">
        <h2 className="text-base font-semibold">{store.name}</h2>
        <p className="text-sm text-gray-600">{menusText}</p>
      </div>

      {/* 우측: 남은 개수 */}
      <div className="flex flex-col items-center justify-center w-16">
        <div
          className={clsx(
            "text-base font-bold",
            store.remain === 0 ? "text-red-500" : "text-orange-500"
          )}
        >
          {store.remain}개
        </div>
        <div className="text-xs text-gray-500">남았어요!</div>
      </div>
    </div>
  );
}