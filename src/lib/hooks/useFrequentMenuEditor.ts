'use client';

import { mockFrequentMenus } from "@/constants/mockStores";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useFrequentMenuEditor(isNew: boolean, id?: string) {
  const router = useRouter();

  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [dirty, setDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);

  // ✅ id 있으면 mock 데이터 불러오기
  useEffect(() => {
    if (!isNew && id) {
      const found = mockFrequentMenus.find(m => m.id === id);
      if (found) setItems(found.items);
    }
  }, [isNew, id]);

  const addMenu = () => {
    const text = input.trim();
    if (!text) return;
    setItems(prev => [...prev, text]);
    setInput("");
    setDirty(true);
  };

  const removeMenu = (i: number) => {
    setItems(prev => prev.filter((_, idx) => idx !== i));
    setDirty(true);
  };

  const save = () => {
    if (isNew) {
      console.log("POST new frequent menu:", items);
    } else {
      console.log("PUT update frequent menu:", id, items);
    }
    setDirty(false);
    router.push("/admin/menu/frequent");
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