import type { Notice } from "@/types/notice";
import { API_BASE } from "../config";
import { http } from "../http";

/** GET /notices */
export function getNotices(signal?: AbortSignal) {
  return http<Notice[]>(`${API_BASE}/notices`, { method: "GET", signal });
}

/** GET /notices/{id} */
export function getNoticeDetail(id: number, signal?: AbortSignal) {
  return http<Notice>(`${API_BASE}/notices/${id}`, { method: "GET", signal });
}

export async function createNotice(payload: { title: string; content: string }) {
  return http(`${API_BASE}/notices`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}