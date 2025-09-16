import { StoreListItem } from "@/types/store";
import clsx from "clsx";
import { RefreshCcw } from "lucide-react";
import { useRouter } from 'next/navigation';


export default function MapStoreCard({ store, onReload }: { store: StoreListItem; onReload?: () => void }) {
  const router = useRouter();

  const handleNameClick = () => {
    router.push(`/store/${store.id}`);
  };

  return (
    <div className="w-full bg-white rounded-t-2xl shadow-[0_-4px_4px_rgba(0,0,0,0.2)] pt-3 min-h-[320px]">
      {/* 드래그 핸들 */}
      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3" />

      {/* 가게 정보 */}
      <div className="px-4 relative">
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
        <button
          onClick={onReload}
          className="absolute top-0 right-4 p-2 text-gray-500 hover:text-orange-500 transition"
          aria-label="새로고침"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>

      {/* 오늘의 천밥 */}
      <div className="absolute bottom-0 left-0 w-full bg-orange-500 text-white px-4 py-3 flex justify-between items-center pb-[50px]">
        <div>
          <p className="font-semibold text-lg">오늘의 천밥</p>
          <p className="text-sm">
            {store.todayMenu && store.todayMenu.menus.length > 0
              ? store.todayMenu.menus.join(', ')
              : store.open
                ? "메뉴 정보 없음"
                : "오늘 휴무"}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center w-16">
        <div
          className={clsx(
            "text-base font-bold",
          )}
        >
          {store.remain}개
        </div>
        <div className="text-xs text-white">남았어요!</div>
      </div>
      </div>
    </div>
  );
}