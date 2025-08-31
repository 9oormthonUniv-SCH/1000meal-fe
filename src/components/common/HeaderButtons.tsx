'use client';

import { getCookie } from '@/lib/auth/cookies'; // ✅ 여기서 import
import { Bell, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeaderButtons() {
  const router = useRouter();
  const token = getCookie('accessToken');
  const role = getCookie('role');
  console.log(role);
  const goToMyPage = () => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (role?.toUpperCase() === 'ADMIN') {
      router.push('/admin');
      console.log("!!");
    } else {
      router.push('/mypage');
    }
  };

  return (
    <div className="absolute top-0 right-0 flex gap-3">
      <button
        onClick={() => router.push('/notification')}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        aria-label="알림"
      >
        <Bell className="w-5 h-5 text-gray-700" />
      </button>

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