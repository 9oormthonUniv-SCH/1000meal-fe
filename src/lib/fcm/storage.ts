export type StoredFcmNotification = {
  /** 로컬에서만 쓰는 ID */
  id: string;
  title: string;
  body: string;
  createdAt: string; // ISO
  /** 데이터 페이로드(있다면) */
  data?: Record<string, string>;
};

const KEY = "fcm_notifications_v1";
const MAX_ITEMS = 50;

export function readStoredFcmNotifications(): StoredFcmNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredFcmNotification[];
  } catch {
    return [];
  }
}

export function appendStoredFcmNotification(noti: StoredFcmNotification) {
  if (typeof window === "undefined") return;
  const prev = readStoredFcmNotifications();
  const next = [noti, ...prev].slice(0, MAX_ITEMS);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

