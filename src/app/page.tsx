'use client';

import { useState } from 'react';
import StoreCard from "@/components/main/StoreCard";
import { mockStores } from "@/constants/mockStores";
import MapView from "@/components/main/MapView";
import { Store } from "@/types/store";
import NoticePreview from '@/components/main/NoticePreview';
import { notices } from '@/constants/mockStores'; // notices도 같이 정의돼있다고 가정
import HeaderButtons from '@/components/common/HeaderButtons';
import { RefreshCcw } from 'lucide-react'; // 새로고침 아이콘

export default function HomePage() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeList, setStoreList] = useState<Store[]>(mockStores); // ✅ 상태로 관리

  const handleRefresh = () => {
    // 실제로는 서버에서 다시 fetch 해야 하지만 지금은 mockStores 재할당
    setStoreList([...mockStores]);
  };

  return (
    <main
      className={`relative max-w-md mx-auto px-4 py-6 transition-all ${
        selectedStore ? 'pb-[180px]' : ''
      }`}
    >
      <HeaderButtons />
      <h1 className="text-2xl font-bold mb-5">오늘 순밥</h1>

      <MapView />

      {/* 제목 + 새로고침 버튼 */}
      <div className="flex justify-between items-center mt-5">
        <h1 className="text-xl font-bold">오늘의 천밥</h1>
        <button
          onClick={handleRefresh}
          className="text-sm text-gray-600 hover:text-orange-500 transition flex items-center gap-1"
        >
          <RefreshCcw className="w-5 h-5 text-gray-400 hover:text-orange-500" />
        </button>
      </div>

      {/* 스토어 리스트 */}
      <div className="pt-5">
        {storeList.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            isSelected={selectedStore?.id === store.id}
            onClick={() => setSelectedStore(store)}
          />
        ))}
      </div>

      <NoticePreview notices={notices} />
    </main>
  );
}