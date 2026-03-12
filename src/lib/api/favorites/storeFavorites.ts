import { API_BASE } from "../config";
import { http } from "../http";

export type FavoriteStore = {
  storeId: number;
  name: string;
  address: string;
  imageUrl: string;
  open: boolean;
  remain: number;
};

/** GET /favorites/stores */
export function getFavoriteStores(signal?: AbortSignal) {
  return http<FavoriteStore[]>(`${API_BASE}/favorites/stores`, { method: "GET", signal });
}

/** POST /favorites/stores/{storeId} */
export function addFavoriteStore(storeId: number) {
  return http<{ storeId: number; favorite: boolean }>(
    `${API_BASE}/favorites/stores/${storeId}`,
    { method: "POST" }
  );
}

/** DELETE /favorites/stores/{storeId} */
export function removeFavoriteStore(storeId: number) {
  return http<{ storeId: number; favorite: boolean }>(
    `${API_BASE}/favorites/stores/${storeId}`,
    { method: "DELETE" }
  );
}

