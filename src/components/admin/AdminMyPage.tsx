'use client';

import { clearSession } from '@/lib/auth/session.client';
import clsx from 'clsx';
import { ChevronRight, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '../common/Header';

export default function AdminMyPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // 영업중 여부

  const handleToggle = () => {
    setIsOpen(!isOpen);
    // TODO: 서버에 상태 반영
  };

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  return (
    <div className="w-full h-dvh pt-[56px]">
      <Header title="" />
      <div className="bg-white-100 px-4">
        {/* 상단 영역 */}
        <div className="bg-white rounded-2xl p-4 mt-4 mb-4 relative shadow-even">
          <button className="absolute right-4 top-4 text-gray-500">
            <Settings className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-300" />
            <p className="font-bold text-xl">김순밥</p>
            <span className="text-sm text-white bg-blue-300 px-2 py-1 rounded-xl">
              관리자
            </span>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-100 px-4 py-6">
        {/* 컨트롤 패널 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 영업중 여부 */}
          <div
            className={clsx(
              'aspect-square rounded-2xl p-4 shadow text-left relative flex flex-col justify-between transition-colors duration-200',
              isOpen ? 'bg-blue-300 text-white' : 'bg-white text-gray-400'
            )}
          >
            <div>
              <p className="text-lg font-semibold mb-2">{isOpen ? '영업 중' : '영업 종료'}</p>
            </div>
            {/* ✅ 토글 버튼 */}
            <div className="absolute bottom-4 right-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOpen}
                  onChange={handleToggle}
                  className="sr-only peer"
                />
                <div
                  className={clsx(
                    'w-16 h-9 rounded-full relative transition-colors duration-300',
                    isOpen ? 'bg-white' : 'bg-gray-300'
                  )}
                >
                  <div
                    className={clsx(
                      'absolute top-1 w-7 h-7 rounded-full transition-transform duration-300',
                      isOpen ? 'translate-x-8 bg-blue-300' : 'translate-x-1.5 bg-white'
                    )}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* 재고 관리 */}
          <button
            onClick={() => router.push('/admin/inventory')}
            className="aspect-square rounded-2xl p-4 bg-white shadow text-left relative flex flex-col justify-between"
          >
            <p className="text-lg font-semibold text-gray-800">재고 관리</p>
            <ChevronRight className="w-9 h-9 absolute bottom-4 right-4 text-gray-400" />
          </button>
        </div>

        {/* 메뉴 관리 */}
        <button
          onClick={() => router.push('/admin/menu')}
          className="w-full flex justify-between items-center mt-4 rounded-2xl p-4 bg-white shadow"
        >
          <p className="text-lg font-semibold text-gray-800">메뉴 관리</p>
          <ChevronRight className="w-9 h-9 text-gray-400" />
        </button>

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="w-full flex justify-center items-center mt-6 rounded-2xl p-4 bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
        >
          <LogOut className="w-5 h-5 mr-2" />
          로그아웃
        </button>
      </div>
    </div>
  );
}