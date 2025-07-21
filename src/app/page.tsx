// app/page.tsx
'use client';

import { useState } from 'react';
import StoreCard from "@/components/main/StoreCard";
import { mockStores } from "@/constants/mockStores";
import MapView from "@/components/main/MapView";
import { Store } from "@/types/store";

export default function HomePage() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  return (
    <main
      className={`relative max-w-md mx-auto px-4 py-6 transition-all ${
        selectedStore ? 'pb-[180px]' : ''
      }`}
    >
      <h1 className="text-2xl font-bold mb-5">천원의 아침밥 🍚</h1>

      <MapView onSelectStore={setSelectedStore} />
      <h1 className="text-xl font-bold mt-5">오늘의 천밥</h1>

      <div className="pt-5">
        {mockStores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            isSelected={selectedStore?.id === store.id} // ✅ 주황 테두리 조건
            onClick={() => setSelectedStore(store)}      // ✅ 리스트에서도 선택 가능
          />
        ))}
      </div>
    </main>
  );
}