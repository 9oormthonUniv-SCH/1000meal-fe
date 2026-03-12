'use client';

import Toast from "@/components/common/Toast";
import type { StoredFcmNotification } from "@/lib/fcm/storage";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function FcmToast() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const lastNotiRef = useRef<StoredFcmNotification | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const onFcm = (e: Event) => {
      const ce = e as CustomEvent<StoredFcmNotification>;
      const noti = ce.detail;
      if (!noti) return;

      lastNotiRef.current = noti;
      setMessage(`${noti.title}${noti.body ? ` - ${noti.body}` : ""}`);
      setShow(true);

      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setShow(false), 2500);
    };

    window.addEventListener("fcm-notification", onFcm);
    return () => {
      window.removeEventListener("fcm-notification", onFcm);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  // Toast 컴포넌트가 중앙 고정이라 클릭 액션을 직접 제공하기 어려워,
  // show 중에는 전체를 클릭하면 알림 페이지로 이동하도록 처리합니다.
  useEffect(() => {
    if (!show) return;
    const onClick = () => {
      setShow(false);
      router.push("/notification");
    };
    window.addEventListener("click", onClick, { once: true });
    return () => window.removeEventListener("click", onClick);
  }, [router, show]);

  return <Toast show={show} message={message} />;
}

