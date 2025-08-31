'use client';

import { StoreDetail } from "@/types/store";
import { isStoreOpen } from "@/utils/isStoreOpen";

interface Props {
  store: StoreDetail;
}

export default function StoreInfo({ store }: Props) {
  return (
    <div className="space-y-1 px-4 py-3">
      <h2 className="font-bold text-gray-900 py-1 text-xl">{store.name}</h2>
      <p className="text-sm text-gray-400">{store.address}</p>

      {store.phone ? (
        <a
          href={`tel:${store.phone}`}
          className="text-sm text-blue-500 underline hover:text-blue-700 transition-colors"
        >
          {store.phone}
        </a>
      ) : (
        <p className="text-sm text-gray-400">전화번호 미등록</p>
      )}

      <p className="text-sm pt-4 text-red-400 font-semibold">
        {isStoreOpen(store.hours, store.remain) ? '영업 중' : '영업 종료'}
      </p>
      <p className="text-sm pb-2 text-gray-400">
        천원의 아침밥 운영 시간: {store.hours}
      </p>
    </div>
  );
}