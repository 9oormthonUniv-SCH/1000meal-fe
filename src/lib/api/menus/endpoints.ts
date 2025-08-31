import type { DailyMenuResponse, WeeklyMenuResponse } from "@/types/menu";
import { API_BASE } from "../config";
import { http } from "../http";

// 주차별 메뉴 조회
export async function getWeeklyMenu(storeId: number, date: string) {
  return http<WeeklyMenuResponse>(`${API_BASE}/menus/weekly/${storeId}?date=${date}`, {
    method: "GET",
  });
}

export async function getDailyMenu(storeId: number, date: string) {
  return http<DailyMenuResponse | null>(`${API_BASE}/menus/daily/${storeId}?date=${date}`, {
    method: "GET",
  });
}

export async function saveDailyMenu(storeId: number, date: string, menus: string[]) {
  return http<DailyMenuResponse>(`${API_BASE}/menus/daily/${storeId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // 📌 date는 쿼리 X → body로 전달
    body: JSON.stringify({ date, menus }),
  });
}

// 일일 재고 수정
export async function updateDailyStock(menuId: number, stock: number) {
  return http<void>(`${API_BASE}/menus/daily/stock/${menuId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stock }),
  });
}