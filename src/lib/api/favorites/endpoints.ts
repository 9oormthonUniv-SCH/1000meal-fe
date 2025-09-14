import { http } from "@/lib/api/http";

// 그룹 단위 타입
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
  return http<FavoriteGroup>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/group/${groupId}`,
    { method: "GET" }
  );
}

// ✅ 즐겨찾기 저장 (매장 단위 → 새로운 그룹 추가)
export async function addFavorite(storeId: number, menus: string[]) {
  return http<void>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/${storeId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menus),
    }
  );
}

// ✅ 그룹 단위 수정
export async function updateFavorite(groupId: number, menus: string[]) {
  return http<void>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/${groupId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menus),
    }
  );
}

// ✅ 그룹 단위 삭제
export async function deleteFavorite(groupId: number) {
  return http<void>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/${groupId}`,
    {
      method: "DELETE",
    }
  );
}