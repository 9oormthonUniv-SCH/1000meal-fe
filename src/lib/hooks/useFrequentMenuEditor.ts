'use client';

import { storeIdAtom } from "@/atoms/user";
import { getFavorites, saveFavorites } from "@/lib/api/favorites/endpoints";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useFrequentMenuEditor(isNew: boolean, id?: string) {
  const router = useRouter();
  const storeId = useAtomValue(storeIdAtom);

  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [dirty, setDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);

  // 그룹 불러오기
  useEffect(() => {
    if (!isNew && storeId && id) {
      (async () => {
        const data = await getFavorites(storeId);
        const found = data.groups.find(g => g.groupId.toString() === id);
        if (found) setItems(found.menu);
      })();
    }
  }, [isNew, id, storeId]);

  const addMenu = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setItems(prev => [...prev, value]);
    if (!text) setInput(""); // 직접 입력일 때만 초기화
    setDirty(true);
  };

  const removeMenu = (i: number) => {
    setItems(prev => prev.filter((_, idx) => idx !== i));
    setDirty(true);
  };

  const save = async () => {
    if (!storeId) return;
    try {
      await saveFavorites(storeId, items); // 🔹 POST 호출
      setDirty(false);
      router.push("/admin/menu/frequent");
    } catch (err) {
      console.error("즐겨찾는 메뉴 저장 실패:", err);
    }
  };

  const handleBack = () => {
    if (dirty) {
      setPendingAction(() => () => router.push("/admin/menu/frequent"));
      setShowConfirm(true);
    } else {
      router.push("/admin/menu/frequent");
    }
  };

  return {
    items,
    input, setInput,
    dirty, setDirty,
    showConfirm, setShowConfirm,
    pendingAction, setPendingAction,
    addMenu, removeMenu,
    save, handleBack,
  };
}