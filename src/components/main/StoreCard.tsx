'use client';

import { normalizeImageUrl } from "@/lib/utils/imageUrl";
import { getFirstGroupStock, getSingleGroupMenusText } from "@/lib/utils/store";
import type { StoreListItem, TodayMenuGroup } from "@/types/store";
import clsx from "clsx";
import { useRouter } from "next/navigation";

interface Props {
  store: StoreListItem;
  isSelected?: boolean;
  onClick?: () => void;
}

function getMenuGroups(store: StoreListItem): TodayMenuGroup[] | null {
  const tm = store.todayMenu;
  if (!tm?.menuGroups?.length) return null;
  if (tm.menuGroups.length >= 2) return tm.menuGroups;
  return null;
}

export default function StoreCard({ store, isSelected, onClick }: Props) {
  const router = useRouter();
  const handleClick = () => {
    onClick?.();
    router.push(`/store/${store.id}`);
  };

  const menuGroups = getMenuGroups(store);
  const isMultiGroup = menuGroups !== null && menuGroups.length >= 2;

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "flex items-center justify-between gap-4 p-4 mb-4 rounded-2xl shadow-even cursor-pointer transition-all duration-200 border",
        isSelected ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-white"
      )}
    >
      {!isMultiGroup ? (
        /* 기존 단일 메뉴 그룹 레이아웃 (위치·디자인 유지) */
        <>
          {(() => {
            const normalizedImageUrl = normalizeImageUrl(store.imageUrl);
            return (
              <div
                className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                style={{
                  background: "linear-gradient(to bottom, #ffffff, rgba(255, 165, 136, 0.2))",
                }}
              >
                {normalizedImageUrl ? (
                  <img
                    src={normalizedImageUrl}
                    alt={store.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-xl object-contain"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                    No Img
                  </div>
                )}
              </div>
            );
          })()}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold">{store.name}</h2>
            <p className="text-sm text-gray-600">{getSingleGroupMenusText(store)}</p>
          </div>
          <div className="flex flex-col items-center justify-center w-16 flex-shrink-0">
            <div
              className={clsx(
                "text-base font-bold",
                getFirstGroupStock(store) === 0 ? "text-red-500" : "text-orange-500"
              )}
            >
              {getFirstGroupStock(store)}개
            </div>
            <div className="text-xs text-gray-500">남았어요!</div>
          </div>
        </>
      ) : (
        /* 매장 대표이미지 밑 선 + 점 + 그룹별 메뉴/재고 (위치 통일) */
        <>
          <div className="flex flex-col flex-shrink-0 w-12 items-center">
            {(() => {
              const normalizedImageUrl = normalizeImageUrl(store.imageUrl);
              return (
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{
                    background: "linear-gradient(to bottom, #ffffff, rgba(255, 165, 136, 0.2))",
                  }}
                >
                  {normalizedImageUrl ? (
                    <img
                      src={normalizedImageUrl}
                      alt={store.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-xl object-contain"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      No Img
                    </div>
                  )}
                </div>
              );
            })()}
            {/* 점선: 이미지 하단에서 이어져 마지막 점 중앙까지 */}
            <div className="relative flex flex-col">
              <div
                className="absolute left-1/2 top-0 bottom-7 w-0 -translate-x-px border-l-2 border-dashed border-gray-300"
                aria-hidden
              />
              {menuGroups!.map((_, i) => (
                <div
                  key={i}
                  className="h-14 flex items-center justify-center flex-shrink-0"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 relative z-10" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="min-h-12 flex items-center">
              <h2 className="text-base font-semibold">{store.name}</h2>
            </div>
            {menuGroups!.map((group) => (
              <div
                key={group.id}
                className="h-14 flex items-center text-sm text-gray-600 flex-shrink-0"
              >
                {group.menus.length > 0
                  ? group.menus.map((m) => m.name).join(", ")
                  : "메뉴 정보 없음"}
              </div>
            ))}
          </div>
          <div className="flex flex-col w-16 flex-shrink-0 items-center justify-start">
            <div className="min-h-12" />
            {menuGroups!.map((group) => (
              <div
                key={group.id}
                className="h-14 flex flex-col items-center justify-start pt-0.5 flex-shrink-0"
              >
                <div
                  className={clsx(
                    "text-base font-bold",
                    group.stock === 0 ? "text-red-500" : "text-orange-500"
                  )}
                >
                  {group.stock}개
                </div>
                <div className="text-xs text-gray-500">남았어요!</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
