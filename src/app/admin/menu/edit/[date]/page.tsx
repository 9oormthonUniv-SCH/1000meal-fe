'use client';

import MenuEditorLayout from "@/components/admin/menu/edit/MenuEditorLayout";
import WeekNavigator from "@/components/admin/menu/WeekNavigator";
import Toast from "@/components/common/Toast";
import { getDailyMenu, upsertMenuGroupMenus } from "@/lib/api/menus/endpoints";
import { getCookie } from "@/lib/auth/cookies";
import { getStoreIdFromToken } from "@/lib/auth/jwt";
import { mondayOf } from "@/utils/week";
import dayjs from "dayjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminMenuEditPage() {
  const router = useRouter();
  const params = useParams<{ date: string }>();
  const searchParams = useSearchParams();
  const token = getCookie("accessToken");
  const storeId = getStoreIdFromToken(token);

  const groupIdParam = searchParams.get("groupId");
  const groupId = groupIdParam != null && /^\d+$/.test(groupIdParam) ? Number(groupIdParam) : null;

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
    if (!storeId || groupId == null) return;
    (async () => {
      setLoading(true);
      try {
        const res = await getDailyMenu(storeId, selectedId);
        const group = res?.groups?.find((g) => g.id === groupId);
        setMenus(group?.menus ?? []);
        setDirty(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [storeId, selectedId, groupId]);

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
    if (groupId == null) return;
    await upsertMenuGroupMenus(groupId, selectedId, menus);
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

  if (groupId == null) {
    return (
      <div className="w-full min-h-dvh bg-[#F5F6F7] pt-[56px] flex items-center justify-center">
        <p className="text-gray-500">그룹을 선택해 주세요.</p>
        <button
          type="button"
          onClick={() => router.push("/admin/menu")}
          className="ml-2 text-orange-500 font-medium"
        >
          메뉴 관리로 이동
        </button>
      </div>
    );
  }

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
              const path = `/admin/menu/edit/${nextMonday.format("YYYY-MM-DD")}?groupId=${groupId}`;
              if (dirty) {
                setPendingAction(() => () => router.push(path));
                setShowConfirm(true);
                return;
              }
              router.push(path);
            }}
            onSelectDate={(id) => {
              const path = `/admin/menu/edit/${id}?groupId=${groupId}`;
              if (dirty) {
                setPendingAction(() => () => router.push(path));
                setShowConfirm(true);
                return;
              }
              router.push(path);
            }}
          />
        }
        onBack={handleBack}
      />
      <Toast show={showToast} message="저장되었습니다" />
    </>
  );
}