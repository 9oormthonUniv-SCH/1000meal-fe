// src/components/store/StoreCard.tsx
'use client';

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
    className="m-3 rounded-xl shadow-md bg-white w-[140px] cursor-pointer">
      <div className="w-full h-24 rounded-lg overflow-hidden bg-gray-100 mb-2">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={storeName}
            width={140}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>
      <div className='px-3 py-1'>
        <p className="text-sm font-medium text-gray-900">{storeName}</p>
        <p
          className={clsx(
            "text-xs mt-1",
            isOpen ? "text-green-600" : "text-red-500"
          )}
        >
          {isOpen ? "영업 중" : "영업 종료"}
        </p>
      </div>
    </div>
  );
}