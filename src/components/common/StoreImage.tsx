// components/common/StoreImage.tsx
'use client';

import type { StoreDetail } from "@/types/store";
import Image from "next/image";

export default function StoreImage({ store }: { store: StoreDetail }) {
  return (
    <div className="w-full h-56 relative overflow-hidden bg-gradient-to-b from-white/0 to-orange-300/20">
      {store.imageUrl ? (
        <Image
          src={store.imageUrl}
          alt={store.name}
          fill
          className="object-contain object-bottom scale-100" 
          // ✅ object-bottom: 하단 정렬
          // ✅ scale-110: 이미지 살짝 확대 → 밑부분이 가려짐
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white text-lg">
          매장 이미지 없음
        </div>
      )}
    </div>
  );
}