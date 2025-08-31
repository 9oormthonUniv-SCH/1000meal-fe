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

  // ✅ 모달 관련 상태
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // ✅ 날짜 변경시 API 호출
  useEffect(() => {
    if (!storeId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await getDailyMenu(storeId, selectedId);
        setMenus(res?.menus ?? []);
        setDirty(false);
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

  const monday = mondayOf(dayjs(selectedId));

  // ✅ 뒤로가기 wrapper
  const handleBack = () => {
    if (dirty) {
      setPendingAction(() => () => router.back());
      setShowConfirm(true);
      return;
    }
    router.back();
  };

  return (
    <MenuEditorLayout
      stack={menus}
      input={input} setInput={setInput}
      addMenu={addMenu} removeMenu={removeMenu}
      setMenusByWeek={() => {}} setDirty={setDirty}
      selectedId={selectedId} mondayId={monday.format("YYYY-MM-DD")}
      onSave={save}
      showConfirm={showConfirm} setShowConfirm={setShowConfirm}
      pendingAction={pendingAction} setPendingAction={setPendingAction}
      loading={loading}
      extraTop={
        <WeekNavigator
          monday={monday}
          selectedId={selectedId}
          onShiftWeek={(delta) => {
            const nextMonday = monday.add(delta, "week");
            if (dirty) {
              setPendingAction(() =>
                () => router.push(`/admin/menu/edit/${nextMonday.format("YYYY-MM-DD")}`)
              );
              setShowConfirm(true);
              return;
            }
            router.push(`/admin/menu/edit/${nextMonday.format("YYYY-MM-DD")}`);
          }}
          onSelectDate={(id) => {
            if (dirty) {
              setPendingAction(() => () => router.push(`/admin/menu/edit/${id}`));
              setShowConfirm(true);
              return;
            }
            router.push(`/admin/menu/edit/${id}`);
          }}
        />
      }
      // ✅ 뒤로가기 핸들러 내려줌
      onBack={handleBack}
    />
  );
}