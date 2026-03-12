'use client';

import { storeIdAtom } from '@/atoms/user';
import ErrorMessage from '@/components/common/ErrorMessage';
import Header from '@/components/common/Header';
import { ApiError, ServerErrorBody } from '@/lib/api/errors';
import {
  deductMenuGroupStock,
  getDailyMenu,
  updateMenuGroupStock,
  type DeductionUnit,
} from '@/lib/api/menus/endpoints';
import type { DailyMenuGroupItem } from '@/types/menu';
import clsx from 'clsx';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

dayjs.locale('ko');

export default function InventoryPage() {
  const storeId = useAtomValue(storeIdAtom);

  const [groups, setGroups] = useState<DailyMenuGroupItem[]>([]);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  dayjs.extend(utc);
  dayjs.extend(timezone);

  const today = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD");
  const formattedDate = `${dayjs().tz("Asia/Seoul").month() + 1}월 ${dayjs().tz("Asia/Seoul").date()}일 ${dayjs().tz("Asia/Seoul").format("dddd")}`;

  useEffect(() => {
    if (!storeId) return;
    (async () => {
      try {
        const res = await getDailyMenu(storeId, today);
        if (res?.groups?.length) {
          setGroups(res.groups);
          setOpen(res.open ?? false);
        } else {
          setGroups([]);
          setOpen(false);
        }
        setErrorMsg(null);
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          const details: ServerErrorBody | undefined = e.details;
          const reason =
            Array.isArray(details?.errors) && typeof details.errors[0]?.reason === "string"
              ? details.errors[0]!.reason
              : undefined;
          const msg =
            reason ||
            (typeof details?.result === "string" ? details.result : undefined) ||
            e.message ||
            "오늘 재고 불러오기 실패";
          setErrorMsg(msg);
        } else {
          setErrorMsg("오늘 재고 불러오기 실패");
        }
      }
    })();
  }, [storeId, today]);

  const setGroupStock = (groupId: number, nextStock: number) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, stock: nextStock } : g))
    );
  };

  const handleSetStock = async (groupId: number, value: number) => {
    if (!open) {
      setIsModalOpen(true);
      return;
    }
    const nextStock = Math.max(0, value);
    setGroupStock(groupId, nextStock);
    try {
      await updateMenuGroupStock(groupId, nextStock);
      setErrorMsg(null);
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        const details: ServerErrorBody | undefined = e.details;
        const reason =
          Array.isArray(details?.errors) && typeof details.errors[0]?.reason === "string"
            ? details.errors[0]!.reason
            : undefined;
        const msg =
          reason ||
          (typeof details?.result === "string" ? details.result : undefined) ||
          e.message ||
          "재고 업데이트 실패";
        setErrorMsg(msg);
      } else {
        setErrorMsg("재고 업데이트 실패");
      }
    }
  };

  const handleDeduct = async (groupId: number, unit: DeductionUnit) => {
    if (!open) {
      setIsModalOpen(true);
      return;
    }
    const g = groups.find((x) => x.id === groupId);
    const current = g?.stock ?? 0;
    const delta = unit === "SINGLE" ? 1 : unit === "MULTI_FIVE" ? 5 : 10;
    if (current < delta) return;
    const nextStock = current - delta;
    setGroupStock(groupId, nextStock);
    try {
      await deductMenuGroupStock(groupId, unit);
      setErrorMsg(null);
    } catch (e: unknown) {
      setGroupStock(groupId, current);
      if (e instanceof ApiError) {
        const details: ServerErrorBody | undefined = e.details;
        const reason =
          Array.isArray(details?.errors) && typeof details.errors[0]?.reason === "string"
            ? details.errors[0]!.reason
            : undefined;
        const msg =
          reason ||
          (typeof details?.result === "string" ? details.result : undefined) ||
          e.message ||
          "재고 차감 실패";
        setErrorMsg(msg);
      } else {
        setErrorMsg("재고 차감 실패");
      }
    }
  };

  const handleAdjust = (groupId: number, delta: number) => {
    const g = groups.find((x) => x.id === groupId);
    const current = g?.stock ?? 0;
    const nextStock = Math.max(0, current + delta);
    handleSetStock(groupId, nextStock);
  };

  return (
    <div className="w-full min-h-dvh bg-[#FAFAFA] relative pt-[56px]">
      <Header title="재고 관리" />

      <div className="bg-white px-4 py-3 text-lg font-medium text-gray-700 border-b">
        <span className="text-neutral-500">{formattedDate.split(' ')[0]} {formattedDate.split(' ')[1]}</span>{' '}
        <span className="text-orange-400">{formattedDate.split(' ')[2]}</span>
      </div>

      <div className="px-4 py-6 space-y-6">
        {groups.length === 0 && !errorMsg && (
          <p className="text-gray-500 text-center py-8">오늘 등록된 메뉴 그룹이 없습니다.</p>
        )}

        {groups.map((group) => {
          const stock = group.stock ?? 0;
          return (
            <div key={group.id} className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{group.name}</p>
              <div className="bg-white rounded-2xl px-8 py-7 flex items-center justify-between shadow">
                <span
                  className={clsx(
                    "text-xl font-semibold",
                    open ? "text-zinc-900" : "text-stone-300"
                  )}
                >
                  현재 수량
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDeduct(group.id, "SINGLE")}
                    className="w-6 h-6 rounded-full bg-stone-300 text-white text-lg flex items-center justify-center active:bg-stone-400 transition"
                  >
                    –
                  </button>
                  <input
                    value={stock}
                    onChange={(e) => setGroupStock(group.id, Math.max(0, Number(e.target.value)))}
                    onBlur={() => handleSetStock(group.id, stock)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    className={clsx(
                      "h-12 w-24 text-center text-xl font-semibold border rounded",
                      open ? "text-zinc-900" : "text-stone-300"
                    )}
                  />
                  <button
                    onClick={() => handleAdjust(group.id, 1)}
                    className="w-6 h-6 rounded-full bg-stone-300 text-white text-lg flex items-center justify-center active:bg-stone-400 transition"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-2xl flex shadow text-gray-400 text-sm font-medium overflow-hidden">
                {([
                  { value: 10, unit: "MULTI_TEN" as const },
                  { value: 5, unit: "MULTI_FIVE" as const },
                  { value: 1, unit: "SINGLE" as const },
                ]).map(({ value, unit }, idx) => (
                  <button
                    key={value}
                    onClick={() => handleDeduct(group.id, unit)}
                    disabled={stock < value}
                    className={clsx(
                      "flex-1 flex items-center justify-center gap-2 py-8 relative select-none transition",
                      "active:bg-orange-50 active:text-orange-500",
                      stock < value && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span className="w-5 h-5 rounded-full bg-stone-300 text-white text-sm flex items-center justify-center leading-none">
                      –
                    </span>
                    <span className="text-xl font-semibold text-zinc-900">{value}개</span>
                    {idx < 2 && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-px bg-gray-200" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {errorMsg && (
          <div className="mt-4">
            <ErrorMessage msg={errorMsg} />
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white w-72 rounded-2xl p-5 shadow-lg text-center">
            <p className="text-sm font-medium text-gray-800 mb-1">아직 영업 전입니다</p>
            <p className="text-sm text-gray-500 mb-4">
              <span className="text-blue-500 font-semibold">영업중</span>으로 상태를 변경하시겠습니까?
            </p>
            <div className="flex justify-between gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl py-2 bg-gray-100 text-sm text-gray-600 font-medium">아니요</button>
              <button
                onClick={() => {
                  setOpen(true);
                  setIsModalOpen(false);
                }}
                className="flex-1 rounded-xl py-2 bg-blue-400 text-white text-sm font-medium"
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
