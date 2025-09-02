// lib/hooks/useMenuEditor.ts
import { getDailyMenu, saveDailyMenu } from "@/lib/api/menus/endpoints";
import { mondayOf } from "@/utils/week";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

export function useMenuEditor(storeId: number | null, initialDate: Dayjs) {
  const [selectedId, setSelectedId] = useState(initialDate.format("YYYY-MM-DD"));
  const [monday, setMonday] = useState(mondayOf(initialDate));
  const [menus, setMenus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);

  // ✅ 날짜 변경 시 일별 메뉴 불러오기
  useEffect(() => {
    if (!storeId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await getDailyMenu(storeId, selectedId);
        setMenus(res?.menus ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, [storeId, selectedId]);

  // ✅ 저장 함수 제공
  const save = async () => {
    if (!storeId) return;
    await saveDailyMenu(storeId, selectedId, menus);
    setDirty(false);
  };

  return {
    selectedId, setSelectedId,
    monday, setMonday,
    menus, setMenus,
    loading,
    dirty, setDirty,
    save,
  };
}