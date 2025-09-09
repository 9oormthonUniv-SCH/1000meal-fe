import type { StoreDetail, StoreListItem } from "@/types/store";
import { API_BASE } from "../config";
import { http } from "../http";

/** GET /stores */
export function getStoreList(signal?: AbortSignal) {
  return http<StoreListItem[]>(`${API_BASE}/stores`, { method: "GET", signal });
}

/** GET /stores/{id} */
export function getStoreDetail(id: number, signal?: AbortSignal) {
  return http<StoreDetail>(`${API_BASE}/stores/${id}`, { method: "GET", signal });
}

/** POST /stores/status/{id} → 영업 상태 토글 */
export function toggleStoreStatus(id: number) {
  return http<void>(`${API_BASE}/stores/status/${id}`, { method: "POST" });
}