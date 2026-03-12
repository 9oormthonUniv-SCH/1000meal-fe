import type {
  DailyMenuResponse,
  MenuGroupMenusResponse,
  WeeklyMenuResponse,
} from "@/types/menu";
import { API_BASE } from "../config";
import { http } from "../http";

// ─── 조회 ─────────────────────────────────────────────────────────────────

/** 주간 메뉴 그룹 조회 GET /menus/daily/weekly/{storeId}/groups */
export async function getWeeklyMenu(storeId: number, date: string) {
  return http<WeeklyMenuResponse>(
    `${API_BASE}/menus/daily/weekly/${storeId}/groups?date=${encodeURIComponent(date)}`,
    { method: "GET" }
  );
}

/** 일일 메뉴 그룹 조회 (특정 날짜의 그룹 목록 + 재고) */
export async function getDailyMenu(storeId: number, date: string) {
  return http<DailyMenuResponse | null>(
    `${API_BASE}/menus/daily/${storeId}/groups/?date=${encodeURIComponent(date)}`,
    { method: "GET" }
  );
}

// ─── 메뉴 그룹 생성 (매장에 그룹 추가, date 없음) ─────────────────────────────

export type CreateMenuGroupPayload = {
  name: string;
  sortOrder: number;
  capacity: number;
  sortOrderOrDefault?: number;
  capacityOrDefault?: number;
};

/** 매장에 새 메뉴 그룹 생성. 메뉴는 PUT /groups/{groupId}/menus 로 별도 등록 */
export async function createMenuGroup(
  storeId: number,
  payload: CreateMenuGroupPayload
) {
  return http<{
    id: number;
    name: string;
    sortOrder: number;
    stock: number;
    capacity: number;
    menus: string[];
  }>(`${API_BASE}/menus/daily/${storeId}/groups`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── 메뉴 그룹 특정 날짜 메뉴 upsert ────────────────────────────────────────

/** (groupId, date) 조합으로 메뉴 등록 또는 교체. 없으면 생성, 있으면 메뉴만 교체 */
export async function upsertMenuGroupMenus(
  groupId: number,
  date: string,
  menus: string[]
) {
  return http<MenuGroupMenusResponse>(
    `${API_BASE}/menus/daily/groups/${groupId}/menus?date=${encodeURIComponent(date)}`,
    {
      method: "POST",
      body: JSON.stringify({ menus }),
    }
  );
}

// ─── 재고 ─────────────────────────────────────────────────────────────────

/** 메뉴 그룹 재고를 특정 값으로 설정 (+버튼, 직접 입력 시 POST) */
export async function updateMenuGroupStock(groupId: number, stock: number) {
  return http<{ groupId: number; stock: number }>(
    `${API_BASE}/menus/daily/groups/${groupId}/stock`,
    {
      method: "POST",
      body: JSON.stringify({ stock }),
    }
  );
}

export type DeductionUnit = "SINGLE" | "MULTI_FIVE" | "MULTI_TEN";

/** 메뉴 그룹 재고 차감 */
export async function deductMenuGroupStock(
  groupId: number,
  deductionUnit: DeductionUnit
) {
  return http<{ groupId: number; stock: number }>(
    `${API_BASE}/menus/daily/groups/${groupId}/deduct?deductionUnit=${deductionUnit}`,
    { method: "PATCH" }
  );
}

// ─── 레거시 (기존 호출부 호환용, 추후 그룹 기반으로 이전 후 제거) ─────────────

/** @deprecated 메뉴 그룹 단위로 전환 시 upsertMenuGroupMenus(groupId, date, menus) 사용 */
export async function saveDailyMenu(
  storeId: number,
  date: string,
  menus: string[]
) {
  return http<DailyMenuResponse>(
    `${API_BASE}/menus/daily/${storeId}/groups/?date=${encodeURIComponent(date)}`,
    {
      method: "POST",
      body: JSON.stringify({ menus }),
    }
  );
}

/** @deprecated 그룹 단위 사용 시 updateMenuGroupStock(groupId, stock) 사용 */
export async function updateDailyStock(menuId: number, stock: number) {
  return http<void>(`${API_BASE}/menus/daily/group/${menuId}/stock`, {
    method: "POST",
    body: JSON.stringify({ stock }),
  });
}