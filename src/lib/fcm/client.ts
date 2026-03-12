import { appendStoredFcmNotification, type StoredFcmNotification } from "./storage";

type FirebaseMessaging = {
  getToken: (options: { vapidKey: string; serviceWorkerRegistration: ServiceWorkerRegistration }) => Promise<string>;
  onMessage: (next: (payload: Record<string, unknown>) => void) => void;
};

type FirebaseCompat = {
  apps: unknown[];
  initializeApp: (config: Record<string, string>) => void;
  messaging: () => FirebaseMessaging;
};

const FIREBASE_CDN_READY_TIMEOUT_MS = 7000;

function getFirebaseConfigFromEnv() {
  const cfg = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };
  return cfg;
}

function getVapidKeyFromEnv() {
  return process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "";
}

export function isFcmBrowserSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "Notification" in window
  );
}

async function waitForFirebaseCompat(): Promise<FirebaseCompat> {
  const start = Date.now();
  while (Date.now() - start < FIREBASE_CDN_READY_TIMEOUT_MS) {
    const fb = window.firebase as FirebaseCompat | undefined;
    if (fb) return fb;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error("Firebase SDK(CDN)가 아직 로드되지 않았습니다.");
}

export async function registerFcmServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("이 브라우저는 Service Worker를 지원하지 않습니다.");
  }
  // register() 직후에는 아직 activate/ready 전일 수 있어 PushManager.subscribe가 실패할 수 있습니다.
  await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  const readyReg = await navigator.serviceWorker.ready;
  return readyReg;
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "denied" as NotificationPermission;
  if (Notification.permission !== "default") return Notification.permission;
  return await Notification.requestPermission();
}

export async function getOrCreateFcmToken() {
  if (!isFcmBrowserSupported()) throw new Error("FCM을 지원하지 않는 환경입니다.");

  const permission = await requestNotificationPermission();
  if (permission !== "granted") {
    throw new Error("알림 권한이 허용되지 않았습니다.");
  }

  const vapidKey = getVapidKeyFromEnv();
  if (!vapidKey) {
    throw new Error("NEXT_PUBLIC_FIREBASE_VAPID_KEY가 설정되지 않았습니다.");
  }

  const config = getFirebaseConfigFromEnv();
  const missing: string[] = [];
  if (!config.apiKey) missing.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!config.authDomain) missing.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  if (!config.projectId) missing.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  if (!config.storageBucket) missing.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  if (!config.messagingSenderId) missing.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  if (!config.appId) missing.push("NEXT_PUBLIC_FIREBASE_APP_ID");
  if (missing.length) {
    throw new Error(`Firebase 설정(env)이 누락되었습니다: ${missing.join(", ")}`);
  }

  const firebase = await waitForFirebaseCompat();
  if (!firebase.apps?.length) {
    firebase.initializeApp(config);
  }

  const swReg = await registerFcmServiceWorker();
  const messaging = firebase.messaging();
  const token = await messaging.getToken({ vapidKey, serviceWorkerRegistration: swReg });

  if (!token) throw new Error("FCM 토큰 발급에 실패했습니다.");
  return token;
}

export async function attachForegroundMessageListener() {
  if (!isFcmBrowserSupported()) return;

  // 권한 없으면 아무것도 하지 않음 (자동 권한 팝업 방지)
  if (Notification.permission !== "granted") return;

  const config = getFirebaseConfigFromEnv();
  const firebase = await waitForFirebaseCompat().catch(() => null);
  if (!firebase) return;
  if (!config.apiKey || !config.projectId || !config.messagingSenderId || !config.appId) return;

  if (!firebase.apps?.length) {
    firebase.initializeApp(config);
  }

  const messaging = firebase.messaging();
  messaging.onMessage((payload: Record<string, unknown>) => {
    const notification = payload?.notification as Record<string, string> | undefined;
    const data = payload?.data as Record<string, string> | undefined;
    const title = notification?.title || data?.title || "새 알림";
    const body = notification?.body || data?.body || "";

    const stored: StoredFcmNotification = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      title,
      body,
      createdAt: new Date().toISOString(),
      data,
    };
    appendStoredFcmNotification(stored);
    // 같은 탭에서도 즉시 UI 갱신할 수 있게 이벤트 발행
    try {
      window.dispatchEvent(new CustomEvent("fcm-notification", { detail: stored }));
    } catch {
      // noop
    }

    // 포그라운드에서도 OS 알림을 원하면 표시 (권한이 이미 granted인 경우에만)
    try {
    new Notification(title, { body });
    } catch {
      // noop
    }
  });
}

