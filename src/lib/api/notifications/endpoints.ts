import type { NotificationItem } from "@/types/notification";
import { API_BASE } from "../config";
import { http } from "../http";

/**
 * ⚠️ 백엔드 알림 API 스펙이 확정되면 경로/필드를 맞춰야 합니다.
 * 기본 가정:
 * - GET /notifications => NotificationItem[]
 */
export async function getNotifications(signal?: AbortSignal) {
  // http.ts는 404일 때 특수 객체를 반환하는 케이스가 있어(legacy) 여기서 방어적으로 정규화합니다.
  const res = await http<unknown>(`${API_BASE}/notifications`, { method: "GET", signal });
  if (Array.isArray(res)) return res as NotificationItem[];
  return [];
}

