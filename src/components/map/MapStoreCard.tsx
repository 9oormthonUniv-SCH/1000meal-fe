import { Store } from "@/types/store";
import { useRouter } from 'next/navigation';
import StoreInfo from "../common/StoreInfo";

export default function MapStoreCard({ store }: { store: Store }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/store/${store.id}`);
  };
  return (
    <div className="w-full bg-white rounded-t-2xl shadow-[0_-4px_4px_rgba(0,0,0,0.2)] pt-3 min-h-[220px]"
    onClick={handleClick}>
      {/* 드래그 핸들 */}
      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3" />

      <StoreInfo store={store}/>

      {/* 천원의 아침밥 */}
      <div className="mt-4 bg-orange-500 text-white px-4 py-3 flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">오늘의 천밥</p>
          <p className="text-sm">{store.menu.join(', ')}</p>
        </div>
        <div className="text-right pr-3 font-bold text-lg whitespace-nowrap">
          {store.remain}개<br />
          <span className="text-xs font-normal">남았어요!</span>
        </div>
      </div>
    </div>
  );
}