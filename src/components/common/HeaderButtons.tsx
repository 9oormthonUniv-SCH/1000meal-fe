'use client';

import { getSession } from '@/lib/auth/session.client';
import { Bell, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeaderButtons() {
  const router = useRouter();
  const {token, role} = getSession();

  const goToMyPage = () => {
    if (!token) {
      router.push('/login'); // 로그인 안됨
      return;
    }

    if (role === 'admin') {
      router.push('/admin'); // 어드민 마이페이지
    } else {
      router.push('/mypage'); // 일반 유저 마이페이지
    }
  };

  return (
    <div className="absolute top-0 right-0 flex gap-3">
      {/* 알림 버튼 */}
      <button
        onClick={() => router.push('/notification')}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        aria-label="알림"
      >
        <Bell className="w-5 h-5 text-gray-700" />
      </button>

      {/* 마이페이지 버튼 */}
      <button
        onClick={goToMyPage}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        aria-label="마이페이지"
      >
        <User className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}