// app/page.tsx
'use client';

import { useState } from 'react';
import StoreCard from "@/components/StoreCard";
import { mockStores } from "@/constants/mockStores";
import MapView from "@/components/MapView";
import BottomStoreBar from "@/components/BottomStoreBar";
import { AnimatePresence } from "framer-motion";
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

      <div className="pt-5">
      {mockStores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
      </div>

      <AnimatePresence>
        {selectedStore && (
          <BottomStoreBar
            key={selectedStore.id}
            store={selectedStore}
            onClose={() => setSelectedStore(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}