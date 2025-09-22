'use client';

import { storeIdAtom } from '@/atoms/user';
import ErrorMessage from '@/components/common/ErrorMessage';
import Header from '@/components/common/Header';
import { ApiError, ServerErrorBody } from '@/lib/api/errors';
import { getDailyMenu, updateDailyStock } from '@/lib/api/menus/endpoints';
import { DailyMenuResponse } from '@/types/menu';
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

  const [menuId, setMenuId] = useState<number | null>(null);
  const [stock, setStock] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // ✅ 에러 메시지 상태
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const today = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD");
  const formattedDate = `${dayjs().tz("Asia/Seoul").month() + 1}월 ${dayjs().tz("Asia/Seoul").date()}일 ${dayjs().tz("Asia/Seoul").format("dddd")}`;
  useEffect(() => {
    if (!storeId) return;
    (async () => {
      try {
        const res: DailyMenuResponse | null = await getDailyMenu(storeId, today);
        if (res) {
          setMenuId(res.id);
          setStock(res.stock ?? 0);
          setOpen(res.open ?? false);
        } else {
          // 메뉴 없음 = 정상 (초기값 유지)
          setMenuId(null);
          setStock(0);
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

  // ✅ 수량 조절
  const handleAdjustStock = async (value: number) => {
    if (!open) {
      setIsModalOpen(true);
      return;
    }
    const newStock = Math.max(0, stock + value);
    setStock(newStock);

    if (menuId) {
      try {
        await updateDailyStock(menuId, newStock);
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
    }
  };

  return (
    <div className="w-full min-h-dvh bg-[#FAFAFA] relative pt-[56px]">
      <Header title="재고 관리" />

      {/* 날짜 바 */}
      <div className="bg-white px-4 py-3 text-lg font-medium text-gray-700 border-b">
        <span className="text-neutral-500">{formattedDate.split(' ')[0]} {formattedDate.split(' ')[1]}</span>{' '}
        <span className="text-orange-400">{formattedDate.split(' ')[2]}</span>
      </div>

      {/* 재고 패널 */}
      <div className="px-4 py-6">
        <div>
          <div className="bg-white rounded-2xl px-8 py-7 flex items-center justify-between shadow">
            {/* 현재 수량 텍스트 */}
            <span
              className={clsx(
                "text-xl font-semibold", // ✅ 굵게 + 크게
                open ? "text-zinc-900" : "text-stone-300"
              )}
            >
              현재 수량
            </span>

            {/* 수량 조절 */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAdjustStock(-1)}
                className="w-6 h-6 rounded-full bg-stone-300 text-white text-lg flex items-center justify-center active:bg-stone-400 transition"
              >
                –
              </button>

              {/* 입력칸 */}
              <input
                value={stock}
                onChange={(e) => setStock(Math.max(0, Number(e.target.value)))}
                onBlur={async () => {
                  if (menuId) {
                    try {
                      await updateDailyStock(menuId, stock);
                      setErrorMsg(null);
                    } catch {
                      setErrorMsg("재고 업데이트 실패");
                    }
                  }
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && menuId) {
                    try {
                      await updateDailyStock(menuId, stock);
                      setErrorMsg(null);
                      (e.target as HTMLInputElement).blur();
                    } catch {
                      setErrorMsg("재고 업데이트 실패");
                    }
                  }
                }}
                className={clsx(
                  "h-12 w-24 text-center text-xl font-semibold border rounded", // ✅ 크기 + 굵기 확대
                  open ? "text-zinc-900" : "text-stone-300"
                )}
              />

              <button
                onClick={() => handleAdjustStock(1)}
                className="w-6 h-6 rounded-full bg-stone-300 text-white text-lg flex items-center justify-center active:bg-stone-400 transition"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white mt-4 rounded-2xl flex shadow text-gray-400 text-sm font-medium overflow-hidden">
          {[10, 5, 1].map((value, idx) => (
            <button
              key={value}
              onClick={() => handleAdjustStock(-value)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-8 relative select-none transition",
                "active:bg-orange-50 active:text-orange-500" // ✅ active 효과
              )}
            >
              <span className="w-5 h-5 rounded-full bg-stone-300 text-white text-sm flex items-center justify-center leading-none">
                –
              </span>
              <span className="text-xl font-semibold text-zinc-900">
                {value}개
              </span>

              {/* 구분선 */}
              {idx < 2 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-px bg-gray-200" />
              )}
            </button>
          ))}
        </div>

      {/* ✅ 에러 메시지 출력 */}
      {errorMsg && (
        <div className='mt-4'>
          <ErrorMessage msg={errorMsg}/>
        </div>
      )}
      </div>

      {/* 팝업 모달 */}
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