// src/lib/hooks/useFrequentMenuEditor.ts
'use client';

import { storeIdAtom } from "@/atoms/user";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { createFavorite, updateFavorite } from "../api/favorites";

export function useFrequentMenuEditor(isNew: boolean, id?: string) {
  const storeId = useAtomValue(storeIdAtom);
  const { loadGroup } = useFavorites(storeId ?? undefined);

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

  const handleSave = useCallback(async () => {
    if (isNew && storeId) {
      await createFavorite(storeId, items);
    } else if (!isNew && id) {
      await updateFavorite(Number(id), items);
    }
    setDirty(false);
  }, [isNew, storeId, id, items]);

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