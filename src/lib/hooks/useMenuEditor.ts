// lib/hooks/useMenuEditor.ts
import { getDailyMenu, upsertMenuGroupMenus } from "@/lib/api/menus/endpoints";
import { mondayOf } from "@/utils/week";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

export function useMenuEditor(
  storeId: number | null,
  groupId: number | null,
  initialDate: Dayjs
) {
  const [selectedId, setSelectedId] = useState(initialDate.format("YYYY-MM-DD"));
  const [monday, setMonday] = useState(mondayOf(initialDate));
  const [menus, setMenus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!storeId || groupId == null) return;
    (async () => {
      setLoading(true);
      try {
        const res = await getDailyMenu(storeId, selectedId);
        const group = res?.groups?.find((g) => g.id === groupId);
        setMenus(group?.menus ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, [storeId, selectedId, groupId]);

  const save = async () => {
    if (groupId == null) return;
    await upsertMenuGroupMenus(groupId, selectedId, menus);
    setDirty(false);
  };

  return {
    selectedId,
    setSelectedId,
    monday,
    setMonday,
    menus,
    setMenus,
    loading,
    dirty,
    setDirty,
    save,
  };
}