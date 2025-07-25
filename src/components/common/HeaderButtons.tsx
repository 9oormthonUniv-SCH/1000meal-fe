'use client';

import { useRouter } from 'next/navigation';
import { Bell, User } from 'lucide-react';

export default function HeaderButtons() {
  const router = useRouter();

  return (
    <div className="absolute top-5 right-4 flex gap-3">
      <button
        onClick={() => router.push('/notification')}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        aria-label="알림"
      >
        <Bell className="w-5 h-5 text-gray-700" />
      </button>

      <button
        onClick={() => router.push('/login')}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        aria-label="마이페이지"
      >
        <User className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}