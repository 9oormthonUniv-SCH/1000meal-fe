'use client';

import MenuEditorLayout from "@/components/admin/menu/edit/MenuEditorLayout";
import Toast from "@/components/common/Toast";
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

  const [showToast, setShowToast] = useState(false);

  const handleSave = async () => {
    await save();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 800);
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
      <Toast show={showToast} message="저장되었습니다" />
    </>
  );
}