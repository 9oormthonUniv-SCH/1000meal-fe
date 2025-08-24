// app/store/[id]/page.tsx
'use client';

import Header from "@/components/common/Header";
import StoreImage from "@/components/common/StoreImage";
import StoreInfo from "@/components/common/StoreInfo";
import OtherStoresViewer from "@/components/store/OtherStoresViewer";
import WeeklyMenu from "@/components/store/WeeklyMenu";

import { getStoreDetail, getStoreList } from '@/lib/api/stores/endpoints';
import { useApi, useApiWithParams } from "@/lib/hooks/useApi";
import type { StoreDetail, StoreListItem } from "@/types/store";
import { use } from "react";

export default function StoreDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = use(params);   // ⬅️ 여기서 언랩
  const storeId = Number(id);

  const { data: store, loading, error, reload } =
    useApiWithParams<StoreDetail, number>(
      getStoreDetail,
      storeId,
      { enabled: Number.isFinite(storeId) }
    );

  const { data: storeList = []} =
    useApi<StoreListItem[]>(getStoreList, []);

  if (loading && !store) {
    return (
      <div className="w-full h-dvh pt-[56px]">
        <Header title="매장 상세페이지" />
        <div className="p-4 text-sm text-gray-500">불러오는 중…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-dvh pt-[56px]">
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
      <div className="w-full h-dvh pt-[56px]">
        <Header title="매장 상세페이지" />
        <div className="p-4 text-sm text-gray-500">매장을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const otherStores = storeList.filter((s) => s.id !== storeId);

  return (
    <div className="w-full pt-[56px]">
      <Header title="매장 상세페이지" />
      <StoreImage />
      <StoreInfo store={store} />
      <div className="h-3 bg-gray-200 mx-auto mb-3" />
      <WeeklyMenu store={store} />
      <OtherStoresViewer stores={otherStores} />
    </div>
  );
}