import type { WeeklyMenuResponse } from "@/types/menu";
import { API_BASE } from "../config";
import { http } from "../http";

export async function getWeeklyMenu(storeId: number) {
  return http<WeeklyMenuResponse>(`${API_BASE}/menus/weekly/${storeId}`, {
    method: "GET",
  });
}

export async function updateDailyStock(menuId: number, stock: number) {
  return http<void>(`${API_BASE}/menus/daily/stock/${menuId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stock }),
  });
}