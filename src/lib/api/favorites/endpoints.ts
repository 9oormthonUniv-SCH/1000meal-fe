// src/lib/api/favorites/endpoints.ts
import { http } from "@/lib/api/http";

export interface FavoriteGroup {
  groupId: number;
  menu: string[];
}

// 즐겨찾는 메뉴 조회
export async function getFavorites(storeId: number) {
  return http<{ groups: FavoriteGroup[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/${storeId}`,
    { method: "GET" }
  );
}

// 즐겨찾는 메뉴 저장
export async function saveFavorites(storeId: number, menus: string[]) {
  return http<void>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/${storeId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // 📌 string[] 그대로 전송
      body: JSON.stringify(menus),
    }
  );
}