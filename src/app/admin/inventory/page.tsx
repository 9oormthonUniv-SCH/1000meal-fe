'use client';

import { storeIdAtom } from '@/atoms/user';
import ErrorMessage from '@/components/common/ErrorMessage';
import Header from '@/components/common/Header';
import { ApiError } from '@/lib/api/errors';
import { getWeeklyMenu, updateDailyStock } from '@/lib/api/menus/endpoints';
import { WeeklyMenuResponse } from '@/types/menu';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
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

  const today = dayjs().format('YYYY-MM-DD');
  const formattedDate = `${dayjs().month() + 1}월 ${dayjs().date()}일 ${dayjs().format('dddd')}`;

  useEffect(() => {
    if (!storeId) return;
    (async () => {
      try {
        const res: WeeklyMenuResponse = await getWeeklyMenu(storeId);
        const todayMenu = res.dailyMenus.find(d => d.date === today);
        if (todayMenu) {
          setMenuId(todayMenu.id);
          setStock(todayMenu.stock ?? 0);
          setOpen(todayMenu.open ?? false);
        }
        setErrorMsg(null);
      } catch (e: unknown) {
        console.error("오늘 재고 불러오기 실패:", e);
        if (e instanceof ApiError) {
          // ✅ 서버에서 내려준 에러 메시지 우선
          const reason =
            Array.isArray((e.details as any)?.errors) &&
            (e.details as any).errors[0]?.reason;
          const msg =
            reason ||
            (e.details as any)?.result?.message ||
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
          const reason =
            Array.isArray((e.details as any)?.errors) &&
            (e.details as any).errors[0]?.reason;
          const msg =
            reason ||
            (e.details as any)?.result?.message ||
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
      <div className="bg-white px-4 py-3 text-sm font-medium text-gray-700 border-b">
        <span className="text-black">{formattedDate.split(' ')[0]} {formattedDate.split(' ')[1]}</span>{' '}
        <span className="text-red-500">{formattedDate.split(' ')[2]}</span>
      </div>

      {/* 재고 패널 */}
      <div className="px-4 py-6">
        <div>
          <div className="bg-white rounded-2xl px-4 py-5 flex items-center justify-between shadow">
            <span className="text-gray-500 text-md">현재 재고</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAdjustStock(-1)}
                className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 text-sm"
              >
                -
              </button>

              {/* ✅ 입력 가능 */}
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Math.max(0, Number(e.target.value)))}
                onBlur={async () => {
                  if (menuId) {
                    try {
                      await updateDailyStock(menuId, stock);
                      setErrorMsg(null);
                    } catch (err) {
                      console.error("재고 업데이트 실패:", err);
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
                    } catch (err) {
                      console.error("재고 업데이트 실패:", err);
                      setErrorMsg("재고 업데이트 실패");
                    }
                  }
                }}
                className="w-16 text-center text-base font-semibold text-gray-800 border rounded"
              />

              <button
                onClick={() => handleAdjustStock(1)}
                className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 수량 조절 버튼 */}
        <div className="bg-white mt-4 rounded-2xl px-4 py-5 flex shadow text-gray-400 text-sm font-medium">
          {[10, 5, 1].map((value, idx) => (
            <div key={value} onClick={() => handleAdjustStock(-value)} className="flex-1 flex items-center justify-center gap-1 relative">
              <button className="w-5 h-5 rounded-full border border-gray-300 text-xs flex items-center justify-center">–</button>
              <span>{value}개</span>
              {idx < 2 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-px bg-gray-200" />
              )}
            </div>
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