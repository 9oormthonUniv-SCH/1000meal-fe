'use client';

import { storeIdAtom } from "@/atoms/user";
import ConfirmModal from "@/components/admin/menu/edit/ConfirmModel";
import FrequentMenuTable from "@/components/admin/menu/frequent/FrequentMenuTable";
import Header from "@/components/common/Header";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useAtomValue } from "jotai";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FrequentMenuPage() {
  const router = useRouter();
  const storeId = useAtomValue(storeIdAtom);
  // ✅ remove 추가
  const { lists, loading, remove } = useFavorites(storeId ?? undefined);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async () => {
    // ✅ 실제 API 호출
    await remove(Array.from(selectedIds));  
    setSelectedIds(new Set());
    setSelectMode(false);
  };

  const rightElement = selectMode ? (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          setSelectMode(false);
          setSelectedIds(new Set());
        }}
        className="px-3 py-1.5 text-gray-500 text-sm font-semibold"
      >
        취소
      </button>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={selectedIds.size === 0}
        className={`px-3 py-1.5 text-sm font-semibold ${
          selectedIds.size === 0
            ? "text-gray-400 cursor-not-allowed"
            : "text-orange-500"
        }`}
      >
        삭제
      </button>
    </div>
  ) : (
    <button
      onClick={() => setSelectMode(true)}
      className="px-3 py-1.5 text-gray-400 text-sm font-semibold"
    >
      선택
    </button>
  );

  if (loading) return <div className="p-6">불러오는 중...</div>;

  return (
    <div className="w-full min-h-dvh bg-[#F5F6F7] pt-[56px] relative">
      <Header
        title={selectMode ? "" : "자주 쓰는 메뉴"}
        onBack={() => router.push("/admin/menu")}
        rightElement={rightElement}
      />

      <div className="p-4">
        <FrequentMenuTable
          lists={lists}
          selectMode={selectMode}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
          onRowClick={(id) => router.push(`/admin/menu/frequent/${id}`)}
        />

        {!selectMode && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => router.push("/admin/menu/frequent/new")}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-white"
            >
              <Plus className="w-7 h-7" />
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <ConfirmModal
          des="이 동작은 취소할 수 없습니다"
          msg="삭제하시겠습니까?"
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => {
            handleDelete();
            setShowConfirm(false);
          }}
        />
      )}
    </div>
  );
}