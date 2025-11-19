// components/common/StoreImage.tsx
'use client';

import type { StoreDetail } from "@/types/store";
import { normalizeImageUrl } from "@/lib/utils/imageUrl";
import Image from "next/image";

export default function StoreImage({ store }: { store: StoreDetail }) {
  const normalizedImageUrl = normalizeImageUrl(store.imageUrl);
  
  return (
    <div className="w-full h-56 relative overflow-hidden bg-gradient-to-b from-white/0 to-orange-300/20">
      {normalizedImageUrl ? (
        <Image
          src={normalizedImageUrl}
          alt={store.name}
          fill
          className="object-contain object-bottom scale-100" 
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white text-lg">
          매장 이미지 없음
        </div>
      )}
    </div>
  );
}