'use client';

import MenuEditorLayout from "@/components/admin/menu/edit/MenuEditorLayout";
import { useFrequentMenuEditor } from "@/lib/hooks/useFrequentMenuEditor";

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

  return (
    <MenuEditorLayout
      stack={items}
      input={input} setInput={setInput}
      addMenu={addMenu} removeMenu={removeMenu}
      setMenusByWeek={() => {}} setDirty={setDirty}
      selectedId={id ?? "new"} mondayId="frequent"
      onSave={save} onBack={handleBack}
      showConfirm={showConfirm}
      setShowConfirm={setShowConfirm}
      pendingAction={pendingAction} setPendingAction={setPendingAction}
      loading={false}
    />
  );
}