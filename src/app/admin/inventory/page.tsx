'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

export default function InventoryPage() {
  const [stock, setStock] = useState(100);
  const [open, setOpen] = useState(false); // 영업 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 팝업

  const now = dayjs();
  const formattedDate = `${now.month() + 1}월 ${now.date()}일 ${now.format('dddd')}`;

  const handleAdjustStock = (value: number) => {
    if (!open) {
      setIsModalOpen(true);
      return;
    }
    setStock((prev) => Math.max(0, prev + value));
  };

  return (
    <div className="w-full min-h-dvh bg-[#FAFAFA] relative">
      <Header title="재고 관리" />

      {/* 날짜 바 */}
      <div className="bg-white px-4 py-3 text-sm font-medium text-gray-700 border-b">
        <span className="text-black">{formattedDate.split(' ')[0]} {formattedDate.split(' ')[1]}</span>{' '}
        <span className="text-red-500">{formattedDate.split(' ')[2]}</span>
      </div>

      {/* 재고 패널 */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl px-4 py-5 flex items-center justify-between shadow">
          <span className="text-gray-500 text-md">현재 재고</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAdjustStock(-1)}
              className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 text-sm"
            >
              -
            </button>
            <div className="w-16 text-center text-base font-semibold text-gray-800">{stock}</div>
            <button
              onClick={() => handleAdjustStock(1)}
              className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 text-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* 수량 조절 버튼 */}
        <div className="bg-white mt-4 rounded-2xl px-4 py-5 flex shadow text-gray-400 text-sm font-medium">
          {[10, 5, 1].map((value, idx) => (
            <div
              key={value}
              onClick={() => handleAdjustStock(-value)}
              className="flex-1 flex items-center justify-center gap-1 relative"
            >
              <button className="w-5 h-5 rounded-full border border-gray-300 text-xs flex items-center justify-center">–</button>
              <span>{value}개</span>
              {idx < 2 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-px bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ 팝업 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white w-72 rounded-2xl p-5 shadow-lg text-center">
            <p className="text-sm font-medium text-gray-800 mb-1">아직 영업 전입니다</p>
            <p className="text-sm text-gray-500 mb-4">
              <span className="text-blue-500 font-semibold">영업중</span>으로 상태를 변경하시겠습니까?
            </p>

            <div className="flex justify-between gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-xl py-2 bg-gray-100 text-sm text-gray-600 font-medium"
              >
                아니요
              </button>
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