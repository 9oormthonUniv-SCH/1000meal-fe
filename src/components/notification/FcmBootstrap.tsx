'use client';

import { useEffect } from "react";
import { attachForegroundMessageListener } from "@/lib/fcm/client";
import { useRouter } from "next/navigation";
import FcmToast from "@/components/notification/FcmToast";

/**
 * 앱 전역에서 FCM 포그라운드 수신 리스너를 연결합니다.
 * - 권한이 granted인 경우에만 동작(자동 권한 팝업 없음)
 * - firebase compat SDK는 RootLayout의 Script로 로드됩니다.
 */
export default function FcmBootstrap() {
  const router = useRouter();

  useEffect(() => {
    void attachForegroundMessageListener();
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event?.data?.type === "OPEN_NOTIFICATION_PAGE") {
        router.push("/notification");
      }
    };
    navigator.serviceWorker?.addEventListener("message", onMessage);
    return () => navigator.serviceWorker?.removeEventListener("message", onMessage);
  }, [router]);

  return <FcmToast />;
}

