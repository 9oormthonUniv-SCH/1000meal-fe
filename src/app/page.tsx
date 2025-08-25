// app/page.tsx (또는 네가 쓰는 HomePage 경로)
'use client';

import HeaderButtons from '@/components/common/HeaderButtons';
import MapView from "@/components/main/MapView";
import NoticePreview from '@/components/main/NoticePreview';
import StoreCard from "@/components/main/StoreCard";
import { RefreshCcw } from 'lucide-react';
import { useState } from 'react';

import ErrorMessage from '@/components/common/ErrorMessage';
import { notices } from '@/constants/mockStores'; // 공지 목업 유지 시
import { getStoreList } from '@/lib/api/stores/endpoints';
import { useApi } from '@/lib/hooks/useApi';
import type { StoreListItem } from "@/types/store";
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function HomePage() {
  const [selectedStore, setSelectedStore] = useState<StoreListItem | null>(null);
  const pathname = usePathname();

  const { data: storeList = [], loading, error, reload } =
    useApi<StoreListItem[]>(getStoreList, [pathname]);
  return (
    <main
      className={`relative max-w-md px-4 py-6 transition-all ${
        selectedStore ? 'pb-[180px]' : ''
      }`}
    >
      <div className="relative mb-12">
        <HeaderButtons />
        <Image
          src="/logo.png"
          alt="오늘 순밥"
          width={120}   // 필수
          height={32}   // 필수
          className="h-8 absolute top-0 left-0 object-contain"
        />
      </div>

      <MapView stores={storeList ?? []}/>

      <div className="flex justify-between items-center mt-5">
        <h1 className="text-xl font-bold">오늘의 천밥</h1>
        <button
          onClick={reload}
          className="text-sm text-gray-600 hover:text-orange-500 transition flex items-center gap-1"
          aria-label="새로고침"
          disabled={loading}
          title="새로고침"
        >
          <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 상태 표시 */}
      {error ? (
        <div className="mt-4 text-sm text-red-600 border border-red-200 rounded-md p-3 bg-red-50">
          {error}
        </div>
      ) : loading && storeList.length === 0 ? (
        <div className="mt-4 text-sm text-gray-500">불러오는 중…</div>
      ) : (
        <>
          <div className="pt-5">
            {storeList.length === 0 ? (
              <ErrorMessage msg={"표시할 매장이 없습니다."} />
            ) : (
              storeList.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  isSelected={selectedStore?.id === store.id}
                  onClick={() => setSelectedStore(store)}
                />
              ))
            )}
          </div>
        </>
      )}
      

      <NoticePreview notices={notices} />
    </main>
  );
}