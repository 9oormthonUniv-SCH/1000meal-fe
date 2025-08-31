'use client';

import { storeIdAtom } from "@/atoms/user";
import MenuEditorLayout from "@/components/admin/menu/edit/MenuEditorLayout";
import WeekNavigator from "@/components/admin/menu/WeekNavigator";
import { getDailyMenu, saveDailyMenu } from "@/lib/api/menus/endpoints";
import { mondayOf } from "@/utils/week";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminMenuEditPage() {
  const router = useRouter();
  const params = useParams<{ date: string }>();
  const storeId = useAtomValue(storeIdAtom);

  const selectedId = params?.date && dayjs(params.date).isValid()
    ? params.date
    : dayjs().format("YYYY-MM-DD");

  const [menus, setMenus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [input, setInput] = useState("");

  // ✅ 날짜 변경시 API 호출
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

  const addMenu = () => {
    if (!input.trim()) return;
    setMenus(prev => [...prev, input.trim()]);
    setInput("");
    setDirty(true);
  };

  const removeMenu = (idx: number) => {
    setMenus(prev => prev.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const save = async () => {
    if (!storeId) return;
    await saveDailyMenu(storeId, selectedId, menus);
    setDirty(false);
  };

  const monday = mondayOf(dayjs(selectedId));console.log("선택된 날짜", selectedId);

  return (
    <MenuEditorLayout
      stack={menus}
      input={input} setInput={setInput}
      addMenu={addMenu} removeMenu={removeMenu}
      setMenusByWeek={() => {}} setDirty={setDirty}
      selectedId={selectedId} mondayId={monday.format("YYYY-MM-DD")}
      onSave={save} showConfirm={false}
      setShowConfirm={() => {}} pendingAction={null} setPendingAction={() => {}}
      loading={loading}
      extraTop={
        <WeekNavigator
          monday={monday}
          selectedId={selectedId}
          onShiftWeek={(delta) => {
            const nextMonday = monday.add(delta, "week");
            router.push(`/admin/menu/edit/${nextMonday.format("YYYY-MM-DD")}`);
          }}
        />
      }
    />
  );
}