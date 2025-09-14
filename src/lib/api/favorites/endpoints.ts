// src/lib/api/favorites/endpoints.ts
import { http } from "@/lib/api/http";

export interface FavoriteGroup {
  groupId: number;
  menu: string[];
}

// 매장 단위 전체 즐겨찾기 그룹 조회
export async function getFavorites(storeId: number) {
  return http<{ groups: FavoriteGroup[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/store/${storeId}`,
    { method: "GET" }
  );
}

// 그룹 단위 상세 조회
export async function getFavoriteGroup(groupId: number) {
  return http<{ groups: FavoriteGroup[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/group/${groupId}`,
    { method: "GET" }
  );
}

// 즐겨찾기 저장
export async function saveFavorite(storeId: number, menus: string[]) {
  return http<void>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/${storeId}`, // ✅ 수정된 엔드포인트
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menus),
    }
  );
}

// 즐겨찾기 삭제
export async function deleteFavorite(storeId: number, groupIds: number[]) {
  return http<void>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/${storeId}/groups`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(groupIds),
    }
  );
}