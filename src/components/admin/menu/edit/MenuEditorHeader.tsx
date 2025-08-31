'use client';

import Header from "@/components/common/Header";

export default function MenuEditorHeader({
  onSave,
  onBack, // ✅ 새로 추가
}: {
  onSave: () => void;
  onBack: () => void; // ✅ 타입 정의
}) {
  return (
    <Header
      title="메뉴 수정"
      rightElement={
        <button
          onClick={onSave}
          className="px-3 py-1.5 rounded-xl bg-orange-500 text-white text-sm font-semibold"
        >
          저장
        </button>
      }
      onBack={onBack} // ✅ 여기서 그대로 사용
    />
  );
}