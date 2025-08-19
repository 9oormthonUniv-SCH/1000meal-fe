'use client';

import { useRouter } from 'next/navigation';
import { Bell, User, Repeat } from 'lucide-react';
import { useState } from 'react';

export default function HeaderButtons() {
  const router = useRouter();
  const [role, setRole] = useState<'admin' | 'student'>('admin'); // 기본값: admin

  const goToMyPage = () => {
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
        onClick={() => router.push('/login')}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        aria-label="마이페이지"
      >
        <User className="w-5 h-5 text-gray-700" />
      </button>

      {/* 역할 토글 버튼 (개발용) */}
      <button
        onClick={() => setRole((prev) => (prev === 'admin' ? 'student' : 'admin'))}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        aria-label="역할 토글"
        title={`현재 역할: ${role}`}
      >
        <Repeat className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}