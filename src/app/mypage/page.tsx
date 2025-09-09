'use client';

import Header from '@/components/common/Header';
import Toast from '@/components/common/Toast';
import { ApiError } from '@/lib/api/errors';
import { getMe } from '@/lib/api/users/endpoints';
import { getCookie } from '@/lib/auth/cookies';
import { MeResponse } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MyPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);

  const clearCookiesAndLogout = () => {
    document.cookie =
      'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie =
      'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.replace('/login');
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
      } catch (e: unknown) {
        console.log(e);
        if (e instanceof ApiError && e.status === 401) {
          router.replace('/login');
        } else {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500); // 1초 후 사라짐
  };


  if (loading) return <div className="p-6">불러오는 중...</div>;
  if (!me) return null;

  return (
    <div className="flex flex-col pt-[56px] bg-gray-100 min-h-dvh">
      <Header title="마이페이지" />

      <div className="flex flex-col">
        <div className="bg-white pb-6">
          {/* 🔹 프로필 카드 */}
          <div className="bg-white rounded-xl shadow-even mt-2 mx-4 p-4 flex items-center justify-between">
            {/* 왼쪽: 프로필 사진 */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">
                👤
              </div>
              <div className="flex flex-col">
                <p className="text-md font-bold">{me.username}</p>
                <p className="text-sm text-gray-500">{me.email}</p>
              </div>
            </div>

            {/* 오른쪽: 역할 뱃지 */}
            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600">
              {me.role === 'STUDENT' ? '학생' : me.role}
            </span>
          </div>
        </div>

        {/* 🔹 메뉴 리스트 */}
        <div className="bg-white mt-6 divide-y">
          <button className="w-full text-left px-5 py-4 text-gray-700 hover:bg-gray-50"
            onClick={handleClick}
          >
            회원정보 수정
          </button>
          <button className="w-full text-left px-5 py-4 text-gray-700 hover:bg-gray-50"
            onClick={() => router.push('/find-account?tab=pw')}
          >
            비밀번호 변경
          </button>
          <button
            className="w-full text-left px-5 py-4 text-gray-700 hover:bg-gray-50"
            onClick={clearCookiesAndLogout}
          >
            로그아웃
          </button>
          <button className="w-full text-left px-5 py-4 text-red-500 hover:bg-gray-50"
            onClick={handleClick}
          >
            회원탈퇴
          </button>

          <Toast show={showToast} message="🚧 준비중입니다" />
        </div>
      </div>
    </div>
  );
}