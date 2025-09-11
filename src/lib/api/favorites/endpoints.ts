// src/lib/api/favorites/endpoints.ts
import { http } from "@/lib/api/http";

export interface FavoriteGroup {
  groupId: number;
  menu: string[];
}

// ✅ 매장 단위 전체 즐겨찾기 그룹 조회
export async function getFavorites(storeId: number) {
  return http<{ groups: FavoriteGroup[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/store/${storeId}`,
    { method: "GET" }
  );
}

// ✅ 그룹 단위 상세 조회
export async function getFavoriteGroup(groupId: number) {
  return http<{ groups: FavoriteGroup[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/group/${groupId}`,
    { method: "GET" }
  );
}

// ✅ 즐겨찾기 저장 (store 단위에 새로운 그룹 추가 or 갱신)
export async function saveFavorites(storeId: number, menus: string[]) {
  return http<void>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/store/${storeId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menus),
    }
  );
}

export async function deleteFavorites(storeId: number, groupIds: number[]) {
  return http<void>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/${storeId}/groups`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(groupIds), // [0, 1, 2] 형태
    }
  );
}