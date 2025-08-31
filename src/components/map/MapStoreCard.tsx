import { StoreListItem } from "@/types/store";
import { useRouter } from 'next/navigation';

export default function MapStoreCard({ store }: { store: StoreListItem }) {
  const router = useRouter();

  const handleNameClick = () => {
    router.push(`/store/${store.id}`);
  };

  return (
    <div className="w-full bg-white rounded-t-2xl shadow-[0_-4px_4px_rgba(0,0,0,0.2)] pt-3 min-h-[220px]">
      {/* 드래그 핸들 */}
      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3" />

      {/* 가게 정보 */}
      <div className="px-4">
        <h2
          onClick={handleNameClick}
          className="text-lg font-bold cursor-pointer hover:underline"
        >
          {store.name}
        </h2>
        <p className="text-sm mt-1">{store.address}</p>
        <a
          href={`tel:${store.phone}`}
          className="text-sm text-black-600 hover:underline block mt-1"
        >
          📞 {store.phone}
        </a>
        <p className="text-sm mt-1">{store.hours}</p>
      </div>

      {/* 천원의 아침밥 */}
      <div className="mt-4 bg-orange-500 text-white px-4 py-3 flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">오늘의 천밥</p>
          <p className="text-sm">{store.todayMenu?.menus.flat().join(', ')}</p>
        </div>
        <div className="text-right pr-3 font-bold text-lg whitespace-nowrap">
          {store.remain}개<br />
          <span className="text-xs font-normal">남았어요!</span>
        </div>
      </div>
    </div>
  );
}