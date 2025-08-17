import { API_BASE } from "../config";
import { http } from "../http";
import type { StoreListItem, StoreDetail } from "@/types/store";

/** GET /stores */
export function getStoreList(signal?: AbortSignal) {
  return http<StoreListItem[]>(`${API_BASE}/stores`, { method: "GET", signal });
}

/** GET /stores/{id} */
export function getStoreDetail(id: number, signal?: AbortSignal) {
  return http<StoreDetail>(`${API_BASE}/stores/${id}`, { method: "GET", signal });
}