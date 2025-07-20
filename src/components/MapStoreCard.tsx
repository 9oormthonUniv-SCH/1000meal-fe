import { Store } from "@/types/store";
import { isStoreOpen } from "@/utils/isStoreOpen";
import { useRouter } from 'next/navigation';

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

      {/* 매장 정보 */}
      <div className="space-y-1 px-4">
        <h2 className="font-bold text-gray-900 py-4 text-xl">{store.name}</h2>
        <p className="text-sm text-gray-400">{store.address}</p>
        <p className="text-sm text-gray-400">{store.phone || '전화번호 미등록'}</p>
        <p className="text-sm pt-6 text-red-400 font-semibold">
          {isStoreOpen(store.hours, store.remain) ? '영업 중' : '영업 종료'}
        </p>
        <p className="text-sm pb-2 text-gray-400">천원의 아침밥 운영 시간: {store.hours}</p>
      </div>

      {/* 천원의 아침밥 */}
      <div className="mt-4 bg-orange-500 text-white px-4 py-5 flex justify-between items-center">
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