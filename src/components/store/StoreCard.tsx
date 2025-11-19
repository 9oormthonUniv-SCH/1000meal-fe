// src/components/store/StoreCard.tsx
'use client';

import { normalizeImageUrl } from "@/lib/utils/imageUrl";
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface StoreCardProps {
  id: number;
  imageUrl: string;
  storeName: string;
  isOpen: boolean;
}

export default function StoreCard({ id, imageUrl, storeName, isOpen }: StoreCardProps) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/store/${id}`);
  };
  return (
    <div 
    onClick={handleClick}
    className="my-3 rounded-xl shadow-md bg-white w-40 cursor-pointer">
      <div className="w-full h-32 rounded-lg overflow-hidden mb-2 relative bg-gradient-to-b from-white/0 to-orange-300/20">
        {(() => {
          const normalizedImageUrl = normalizeImageUrl(imageUrl);
          return normalizedImageUrl ? (
            <Image
              src={normalizedImageUrl}
              alt={storeName}
              fill
              className="object-contain object-bottom scale-110"
            />
          ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
          );
        })()}
      </div>
      <div className='px-3 py-1 pb-3'>
        <p className="text-sm font-medium text-gray-900">{storeName}</p>
        <p
          className={clsx(
            "text-xs mt-1",
            isOpen ? "text-orange-400" : "text-red-500"
          )}
        >
          {isOpen ? "영업 중" : "영업 종료"}
        </p>
      </div>
    </div>
  );
}