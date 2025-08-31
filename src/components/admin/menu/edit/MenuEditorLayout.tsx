'use client';

import ConfirmModal from "@/components/admin/menu/edit/ConfirmModel";
import MenuEditorHeader from "@/components/admin/menu/edit/MenuEditorHeader";
import MenuInputBar from "@/components/admin/menu/edit/MenuInputBar";
import MenuList from "@/components/admin/menu/edit/MenuList";
import { ReactNode } from "react";

export default function MenuEditorLayout({
  stack,
  input, setInput,
  addMenu, removeMenu,
  setMenusByWeek, setDirty,
  selectedId, mondayId,
  onSave, onBack,
  dirty, showConfirm, setShowConfirm,
  pendingAction, setPendingAction,
  loading,
  extraTop, // WeekNavigator 같은 추가 UI 넣을 수 있음
}: {
  stack: string[];
  input: string;
  setInput: (v: string) => void;
  addMenu: () => void;
  removeMenu: (i: number) => void;
  setMenusByWeek: any;
  setDirty: (v: boolean) => void;
  selectedId: string;
  mondayId: string;
  onSave: () => void;
  onBack: () => void;
  dirty: boolean;
  showConfirm: boolean;
  setShowConfirm: (v: boolean) => void;
  pendingAction: (() => void) | null;
  setPendingAction: (v: (() => void) | null) => void;
  loading: boolean;
  extraTop?: ReactNode;
}) {
  return (
    <div className="w-full min-h-dvh bg-white pt-[56px]">
      <MenuEditorHeader onSave={onSave} onBack={onBack} />

      {extraTop}

      <MenuInputBar
        input={input}
        setInput={setInput}
        addMenu={addMenu}
        setMenusByWeek={setMenusByWeek}
        setDirty={setDirty}
        selectedId={selectedId}
        mondayId={mondayId}
      />

      <div className="p-4">
        <MenuList stack={stack} removeMenu={removeMenu} loading={loading} />
      </div>

      {showConfirm && (
        <ConfirmModal
          des="변경 사항이 있습니다"
          msg="저장하지 않고 나가시겠습니까?"
          onCancel={() => {
            setShowConfirm(false);
            setPendingAction(null);
          }}
          onConfirm={() => {
            setShowConfirm(false);
            setDirty(false);
            if (pendingAction) pendingAction();
            setPendingAction(null);
          }}
        />
      )}
    </div>
  );
}