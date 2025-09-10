'use client';

import { ApiError } from '@/lib/api/errors';
import { getStoreDetail, toggleStoreStatus } from '@/lib/api/stores';
import { getMe } from '@/lib/api/users';
import { getCookie } from '@/lib/auth/cookies';
import { clearSession } from '@/lib/auth/session.client';
import { StoreDetail } from '@/types/store';
import { MeResponse } from '@/types/user';
import clsx from 'clsx';
import { ChevronRight, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../common/Header';
import Toast from '../common/Toast';

export default function AdminMyPage() {
  const router = useRouter();
  const [, setMe] = useState<MeResponse | null>(null);
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [isOpen, setIsOpen] = useState(false); // 영업중 여부

  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500); // 1초 후 사라짐
  };


  useEffect(() => {
    (async () => {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        router.replace('/login');
        return;
      }
      try {
        const user = await getMe(accessToken);
        setMe(user);
  
        if (user.role === 'ADMIN' && user.storeId) {
          const storeData = await getStoreDetail(user.storeId);
          setStore(storeData);
          setIsOpen(storeData.open);
        }
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof ApiError && err.status === 401) {
          clearSession();
          router.replace('/login');
        }
      }
    })();
  }, [router]);

  const handleToggle = async () => {
    try {
      if (!store) return;
  
      await toggleStoreStatus(store.id); // 서버에 상태 토글 요청
      setIsOpen(!isOpen); // UI 갱신
    } catch (err) {
      console.error("영업 상태 변경 실패:", err);
      alert("영업 상태 변경에 실패했습니다.");
    }
  };

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  return (
    <div className="w-full h-dvh pt-[56px]">
      <Header title="" onBack={() => router.push("/")}/>
      <div className="bg-white-100 px-4">
        {/* 상단 영역 */}
        <div className="bg-white rounded-2xl p-4 mt-4 mb-4 relative shadow-even">
          <button className="absolute right-4 top-4 text-gray-500" onClick={handleClick}>
            <Settings className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-300" />
            <p className="font-bold text-xl">{store?.name ?? '가게명 불러오는 중...'}</p>
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
      <Toast show={showToast} message="🚧 준비중입니다" />
    </div>
  );
}