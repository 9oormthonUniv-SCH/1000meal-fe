'use client';

import Header from '@/components/common/Header';
import { getMe } from '@/lib/api/users/endpoints';
import type { User } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MyPage() {
  const router = useRouter();
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await getMe();
        setMe(user);
      } catch (e) {
        console.error(e);
        router.replace('/login');
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

      <div className="p-5 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold">내 정보</h1>
          <p className="text-sm text-gray-600">아이디: {me.userId}</p>
          <p className="text-sm text-gray-600">이름: {me.name}</p>
          <p className="text-sm text-gray-600">이메일: {me.email}</p>
          <p className="text-sm text-gray-600">전화번호: {me.phoneNumber}</p>
          <p className="text-sm text-gray-600">역할: {me.role}</p>
        </div>
      </div>
    </div>
  );
}