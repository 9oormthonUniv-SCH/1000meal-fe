import FavoriteStarButton from "@/components/favorites/FavoriteStarButton";
import { getFirstGroupStock, getSingleGroupMenusText } from "@/lib/utils/store";
import type { StoreListItem, TodayMenuGroup } from "@/types/store";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function MapStoreCard({ store }: { store: StoreListItem; onReload?: () => void }) {
  const router = useRouter();
  const tm = store.todayMenu;
  const groups = tm?.menuGroups ?? [];
  const sortedGroups = [...groups].sort((a, b) => a.sortOrder - b.sortOrder);
  const singleGroup = sortedGroups.length <= 1;

  const handleNameClick = () => {
    router.push(`/store/${store.id}`);
  };

  const menuFallback = store.open ? "메뉴 정보 없음" : "오늘 휴무";

  return (
    <div className="w-full bg-white rounded-t-2xl shadow-[0_-4px_4px_rgba(0,0,0,0.2)] pt-3 min-h-0 flex flex-col">
      {/* 드래그 핸들 */}
      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3 flex-shrink-0" />

      {/* 가게 정보 */}
      <div className="px-4 relative flex-shrink-0">
        <h2
          onClick={handleNameClick}
          className="text-lg font-bold cursor-pointer hover:underline pb-[12px]"
        >
          {store.name}
        </h2>
        <p className="text-sm mt-1 text-gray-600">{store.address}</p>
        {store.phone && store.phone !== "010-0000-0000" ? (
          <a
            href={`tel:${store.phone}`}
            className="text-sm text-gray-600 hover:underline block mt-1"
          >
            📞 {store.phone}
          </a>
        ) : (
          <p className="text-sm text-gray-400">전화번호 미등록</p>
        )}
        <p
          className={clsx(
            "text-sm pt-[20px] font-semibold",
            store.open ? "text-orange-400" : "text-red-500"
          )}
        >
          {store.open ? "영업 중" : "영업 종료"}
        </p>
        <p className="text-sm mt-1 text-gray-600">{store.hours}</p>

        {/* 새로고침 버튼 */}
        <div className="absolute top-0 right-4 flex items-center gap-1">
          <FavoriteStarButton storeId={store.id} className="p-2 rounded-md hover:bg-gray-100" />
        </div>
      </div>

      {/* 오늘의 천밥 - 컨텐츠 흐름에 맞춰 높이 유동 */}
      <div className="w-full bg-orange-500 text-white px-4 py-3 mt-5 pb-10 flex-shrink-0">
        <p className="font-semibold text-lg">오늘의 천밥</p>

        {!tm ? (
          <p className="text-sm mt-1">{menuFallback}</p>
        ) : singleGroup ? (
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm flex-1 min-w-0 pr-2">
              {getSingleGroupMenusText(store) || menuFallback}
            </p>
            <div className="flex flex-col items-end flex-shrink-0 w-16">
              <span className="text-base font-bold">{getFirstGroupStock(store)}개</span>
              <span className="text-xs">남았어요!</span>
            </div>
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            {sortedGroups.map((group) => (
              <MapStoreCardGroupRow key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MapStoreCardGroupRow({ group }: { group: TodayMenuGroup }) {
  const menuText =
    group.menus?.length > 0 ? group.menus.map((m) => m.name).join(", ") : "";
  const stock = group.stock ?? 0;

  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex items-start gap-2 min-w-0 flex-1">
        <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0 mt-1.5" aria-hidden />
        <p className="text-sm truncate">{menuText || "—"}</p>
      </div>
      <div className="flex flex-col items-end flex-shrink-0">
        <span className="text-base font-bold">{stock}개</span>
        <span className="text-xs">남았어요!</span>
      </div>
    </div>
  );
}