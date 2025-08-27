'use client';

import Header from '@/components/common/Header';
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

  const clearCookiesAndLogout = () => {
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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
        console.log("token:", accessToken);
        const user = await getMe(accessToken);
        setMe(user);
      } catch (e: unknown) {
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

  if (loading) return <div>불러오는 중...</div>;
  if (!me) return null;

  return (
    <div className="flex flex-col pt-[56px]">
      <Header title="마이페이지" />

      <div className="p-5 flex flex-col gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">내 정보</h1>
          <p className="text-base text-gray-700 mb-3">아이디: {me.accountId}</p>
          <p className="text-base text-gray-700 mb-3">이름: {me.username}</p>
          <p className="text-base text-gray-700 mb-3">이메일: {me.email}</p>
          <p className="text-base text-gray-700 mb-6">역할: {me.role}</p>
          <button
            className="bg-red-500 text-white rounded-lg px-4 py-2"
            onClick={clearCookiesAndLogout}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}