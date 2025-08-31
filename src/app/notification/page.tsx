'use client';

import Header from '@/components/common/Header';
import { mockNotifications } from '@/constants/mockStores';

export default function NotificationPage() {

  return (
    <div className="w-full max-w-md mx-auto bg-white mt-[56px]">
      <Header title="알림"/>

      <ul className="divide-y">
        {mockNotifications.map((noti) => (
          <li
            key={noti.id}
            className={`flex gap-3 px-4 py-5 ${
              noti.read ? 'bg-white' : 'bg-orange-50'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />

            <div className="flex-1">
              <div className="text-sm font-bold">{noti.title}</div>
              <div className="text-sm text-gray-600">{noti.message}</div>
            </div>

            <div className="text-xs text-gray-400">{noti.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}