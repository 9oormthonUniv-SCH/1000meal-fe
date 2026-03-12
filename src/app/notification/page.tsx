'use client';

import Header from '@/components/common/Header';
import { readStoredFcmNotifications, type StoredFcmNotification } from '@/lib/fcm/storage';
import dayjs from 'dayjs';
import { RefreshCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function NotificationPage() {
  const [localNotis, setLocalNotis] = useState<StoredFcmNotification[]>(
    typeof window !== 'undefined' ? readStoredFcmNotifications() : []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setLocalNotis(readStoredFcmNotifications());

    const onFcm = () => setLocalNotis(readStoredFcmNotifications());
    window.addEventListener('fcm-notification', onFcm as EventListener);

    return () => window.removeEventListener('fcm-notification', onFcm as EventListener);
  }, []);

  const combined = useMemo(() => {
    const toTs = (v: string) => {
      const t = new Date(v).getTime();
      return Number.isFinite(t) ? t : 0;
    };

    const localItems = localNotis.map((n) => ({
      key: `fcm_${n.id}`,
      title: n.title,
      message: n.body,
      time: dayjs(n.createdAt).format('MM.DD HH:mm'),
      href: null as string | null,
      highlight: true,
      _ts: toTs(n.createdAt),
    }));

    // 현재 백엔드에 "알림 내역 조회" API가 노출되지 않아(Firebase 토큰/설정만 존재),
    // 화면에는 일단 FCM으로 받은 로컬 알림만 표시합니다.
    return [...localItems].sort((a, b) => b._ts - a._ts);
  }, [localNotis]);

  return (
    <div className="w-full max-w-md mx-auto bg-white pt-[56px]">
      <Header
        title="알림"
        rightElement={
          <button
            onClick={() => setLocalNotis(readStoredFcmNotifications())}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="새로고침"
            title="새로고침"
          >
            <RefreshCcw className="w-5 h-5 text-gray-700" />
          </button>
        }
      />

      {combined.length === 0 && (
        <p className="px-4 py-6 text-sm text-gray-500">아직 받은 알림이 없습니다.</p>
      )}

      <ul className="divide-y">
        {combined.map((item) => {
          const row = (
            <div
              className={`flex gap-3 px-4 py-5 ${item.highlight ? 'bg-orange-50' : 'bg-white'}`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />

              <div className="flex-1">
                <div className="text-sm font-bold text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-600 line-clamp-2">{item.message}</div>
              </div>

              <div className="text-xs text-gray-400 whitespace-nowrap">{item.time}</div>
            </div>
          );

          return (
            <li key={item.key}>
              {row}
            </li>
          );
        })}
      </ul>
    </div>
  );
}