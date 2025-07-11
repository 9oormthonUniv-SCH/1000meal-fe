'use client'

import { mockStores } from "@/constants/mockStores";
import { notFound, useRouter } from "next/navigation";
import { isStoreOpen } from '@/utils/isStoreOpen';
import { use } from 'react'; // ✅ 필요

export default function StoreDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ unwrap params
  const store = mockStores.find((s) => s.id === id);
  if (!store) return notFound();
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto pb-10">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => router.back()} className="text-sm text-gray-600">← 이전</button>
        <h2 className="text-sm font-semibold text-gray-800">매장 상세</h2>
        <div className="w-10" />
      </div>

      {/* 이미지 */}
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        매장 사진 및 아이콘
      </div>

      {/* 매장 정보 */}
      <div className="px-4 py-3">
        <div className="text-lg font-semibold">{store.name}</div>
        <div className="text-sm text-gray-600">{store.address}</div>
        <a href={`tel:${store.phone}`} className="text-sm text-blue-500">{store.phone}</a>
        <div className="text-sm text-gray-600 mt-2">
          {isStoreOpen(store.hours, store.remain) ? '영업중' : '영업종료'}
        </div>
        <div className="text-sm text-gray-600">
          천원의 아침밥 운영 시간 : {store.hours}
        </div>
      </div>

      {/* 주간 메뉴 */}
      <div className="px-4 pt-4">
        <div className="text-md font-semibold mb-2">Weekly Menu</div>
        <div className="grid grid-cols-3 gap-2">
          {/* 여기에 map 돌려서 메뉴 출력 */}
        </div>
        <div className="text-sm text-right mt-2 text-gray-700 font-medium">
          남은 수량 : {store.remain}개
        </div>
      </div>
    </div>
  );
}