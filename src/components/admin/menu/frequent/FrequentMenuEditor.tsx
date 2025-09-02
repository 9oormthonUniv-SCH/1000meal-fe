'use client';

import MenuEditorLayout from "@/components/admin/menu/edit/MenuEditorLayout";
import Toast from "@/components/common/Toast"; // ✅ 추가
import { useFrequentMenuEditor } from "@/lib/hooks/useFrequentMenuEditor";
import { useState } from "react";

export default function FrequentMenuEditor({ isNew, id }: { isNew: boolean; id?: string }) {
  const {
    items,
    input, setInput,
    setDirty,
    showConfirm, setShowConfirm,
    pendingAction, setPendingAction,
    addMenu, removeMenu,
    save, handleBack,
  } = useFrequentMenuEditor(isNew, id);

  // ✅ 토스트 상태
  const [showToast, setShowToast] = useState(false);

  // ✅ save 래핑
  const handleSave = async () => {
    await save();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 800); // 0.8초 뒤 자동 사라짐
  };

  return (
    <>
      <MenuEditorLayout
        stack={items}
        input={input} setInput={setInput}
        addMenu={addMenu} removeMenu={removeMenu}
        setMenusByWeek={() => {}} setDirty={setDirty}
        selectedId={id ?? "new"} mondayId="frequent"
        onSave={handleSave} onBack={handleBack}
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        pendingAction={pendingAction} setPendingAction={setPendingAction}
        loading={false}
      />

      {/* ✅ 저장 완료 토스트 */}
      <Toast show={showToast} message="저장되었습니다" />
    </>
  );
}