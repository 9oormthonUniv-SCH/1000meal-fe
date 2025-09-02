'use client';

import Header from "@/components/common/Header";

export default function MenuEditorHeader({
  onSave,
  onBack,
}: {
  onSave: () => void;
  onBack: () => void;
}) {
  return (
    <Header
      title="메뉴 수정"
      rightElement={
        <button
          onClick={(e) => {
            e.stopPropagation(); // ✅ 뒤로가기 버블링 방지
            onSave();            // ✅ 부모에서 내려준 handleSave 호출
          }}
          className="px-3 py-1.5 rounded-xl bg-orange-500 text-white text-sm font-semibold"
        >
          저장
        </button>
      }
      onBack={onBack}
    />
  );
}