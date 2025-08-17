// app/store/[id]/page.tsx
'use client';

import Header from "@/components/common/Header";
import StoreInfo from "@/components/common/StoreInfo";
import StoreImage from "@/components/common/StoreImage";
import WeeklyMenu from "@/components/store/WeeklyMenu";

import { getStoreDetail } from '@/lib/api/stores/endpoints';
import type { StoreDetail } from "@/types/store";
import { useApi } from "@/lib/hooks/useApi";
import { use } from "react"; // ⬅️ 포인트: React.use() 사용

export default function StoreDetailPage(
  { params }: { params: Promise<{ id: string }> } // ⬅️ Promise 타입으로 받기
) {
  const { id } = use(params);                     // ⬅️ 언랩
  const storeId = Number(id);

  const { data: store, loading, error, reload } =
    useApi<StoreDetail>(() => getStoreDetail(storeId), [storeId]);

  if (loading && !store) {
    return (
      <div className="w-full h-dvh overflow-hidden pt-[56px]">
        <Header title="매장 상세페이지" />
        <div className="p-4 text-sm text-gray-500">불러오는 중…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-dvh overflow-hidden pt-[56px]">
        <Header title="매장 상세페이지" />
        <div className="p-4">
          <div className="mb-2 text-red-600 text-sm">상세 정보를 불러오지 못했습니다.</div>
          <button
            onClick={reload}
            className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="w-full h-dvh overflow-hidden pt-[56px]">
        <Header title="매장 상세페이지" />
        <div className="p-4 text-sm text-gray-500">매장을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="w-full h-dvh overflow-hidden pt-[56px]">
      <Header title="매장 상세페이지" />
      <StoreImage />
      <StoreInfo store={store} />
      <div className="h-3 bg-gray-200 mx-auto mb-3" />
      <WeeklyMenu store={store} />
    </div>
  );
}