// src/components/common/LogoutButton.tsx
'use client';

import { clearSession } from '@/lib/auth/session.client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.replace('/login'); // 로그인 페이지로 이동
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
    >
      로그아웃
    </button>
  );
}