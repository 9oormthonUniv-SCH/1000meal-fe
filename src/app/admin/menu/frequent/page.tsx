'use client';

import ConfirmModal from "@/components/admin/menu/edit/ConfirmModel";
import Header from "@/components/common/Header";
import { mockFrequentMenus } from "@/constants/mockStores";
import { ChevronRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FrequentMenuPage() {
  const router = useRouter();
  const [lists, setLists] = useState(mockFrequentMenus);

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

  const handleDelete = () => {
    setLists(prev => prev.filter(l => !selectedIds.has(l.id)));
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

  return (
    <div className="w-full min-h-dvh bg-[#F5F6F7] pt-[56px] relative">
      <Header
        title={selectMode ? "" : "자주 쓰는 메뉴"}
        onBack={() => router.push("/admin/menu")}
        rightElement={rightElement}
      />

      <div className="p-4">
        <table className="w-full border border-gray-200 bg-white rounded-xl overflow-hidden">
          <tbody>
            {lists.map(list => (
              <tr
                key={list.id}
                onClick={() =>
                  selectMode
                    ? toggleSelect(list.id)
                    : router.push(`/admin/menu/frequent/${list.id}`)
                }
                className="border-t hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-3 text-sm text-gray-500 truncate h-[50px]">
                  {list.items.join(", ")}
                </td>
                {selectMode ? (
                  <td className="px-4 py-3 text-center ">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(list.id)}
                      readOnly
                      className="w-4 h-4 accent-gray-200"
                    />
                  </td>
                ) : (
                  <td className="px-4 py-3 text-center">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* + 버튼 - 리스트 맨 밑 */}
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

      {/* 삭제 확인 모달 */}
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