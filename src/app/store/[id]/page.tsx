'use client'

import { mockStores } from "@/constants/mockStores";
import { notFound, useRouter } from "next/navigation";
import { use } from 'react';
import Header from "@/components/common/Header";
import StoreInfo from "@/components/common/StoreInfo";
import StoreImage from "@/components/common/StoreImage";
import WeeklyMenu from "@/components/store/WeeklyMenu";

export default function StoreDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ unwrap params
  const router = useRouter();
  
  const store = mockStores.find((s) => s.id === id);
  if (!store) return notFound();

  return (
    <div className="w-full h-dvh overflow-hidden">
      <Header title="매장 상세페이지"/>

      <StoreImage/>

      <StoreInfo store={store}/>

      <div className="h-3 bg-gray-200 mx-auto mb-3" />

      <WeeklyMenu store={store} />
    </div>
  );
}