// src/lib/hooks/useFrequentMenuEditor.ts
'use client';

import { storeIdAtom } from "@/atoms/user";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";

export function useFrequentMenuEditor(isNew: boolean, id?: string) {
  const storeId = useAtomValue(storeIdAtom);
  const { loadGroup, save } = useFavorites(storeId ?? undefined);

  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [dirty, setDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // ✅ 기존 그룹 상세조회
  useEffect(() => {
    if (!isNew && id) {
      (async () => {
        const menus = await loadGroup(id);
        setItems(menus);
      })();
    }
  }, [isNew, id, loadGroup]);

  // 메뉴 추가
  const addMenu = useCallback((menuText?: string) => {
    const text = menuText ?? input.trim();
    if (!text) return;
    setItems(prev => [...prev, text]);
    setInput("");
    setDirty(true);
  }, [input]);

  // 메뉴 삭제
  const removeMenu = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    setDirty(true);
  }, []);

  // 저장
  const handleSave = useCallback(async () => {
    await save(items);
    setDirty(false);
  }, [items, save]);

  // 뒤로가기
  const handleBack = useCallback(() => {
    if (dirty) setShowConfirm(true);
    else history.back();
  }, [dirty]);

  return {
    items,
    input, setInput,
    setDirty,
    showConfirm, setShowConfirm,
    pendingAction, setPendingAction,
    addMenu, removeMenu,
    save: handleSave,
    handleBack,
  };
}