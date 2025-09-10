'use client';

import MenuEditorLayout from "@/components/admin/menu/edit/MenuEditorLayout";
import WeekNavigator from "@/components/admin/menu/WeekNavigator";
import Toast from "@/components/common/Toast";
import { getDailyMenu, saveDailyMenu } from "@/lib/api/menus/endpoints";
import { getCookie } from "@/lib/auth/cookies";
import { getStoreIdFromToken } from "@/lib/auth/jwt";
import { mondayOf } from "@/utils/week";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminMenuEditPage() {
  const router = useRouter();
  const params = useParams<{ date: string }>();
  const token = getCookie("accessToken");
  const storeId = getStoreIdFromToken(token);

  const selectedId = params?.date && dayjs(params.date).isValid()
    ? params.date
    : dayjs().format("YYYY-MM-DD");

  const [menus, setMenus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [input, setInput] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [showToast, setShowToast] = useState(false);

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

  const addMenu = (menuText?: string) => {
    const text = (menuText ?? input).trim();
    if (!text) return;
    setMenus(prev => [...prev, text]);
    if (!menuText) setInput("");
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
    setShowToast(true);
    setTimeout(() => setShowToast(false), 700);
  };

  const monday = mondayOf(dayjs(selectedId));

  const handleBack = () => {
    if (dirty) {
      setPendingAction(() => () => {
        window.location.href = "/admin/menu";
      });
      setShowConfirm(true);
      return;
    }
    window.location.href = "/admin/menu";
  };

  return (
    <>
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
        onBack={handleBack}
      />
      <Toast show={showToast} message="저장되었습니다" />
    </>
  );
}