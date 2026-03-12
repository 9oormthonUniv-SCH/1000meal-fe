// types/menu.ts
/** 주간 조회 시 하루에 해당하는 그룹 하나 (GET .../weekly/{storeId}/groups) */
export type WeeklyDayGroup = {
  groupId: number;
  name: string;
  sortOrder: number;
  stock: number;
  capacity: number;
  menus: string[];
};

/** GET /menus/daily/weekly/{storeId}/groups?date= 응답 */
export interface WeeklyMenuResponse {
  storeId: number;
  startDate: string;
  endDate: string;
  dailyMenus: {
    id: number;
    date: string;       // YYYY-MM-DD
    dayOfWeek: string;  // MONDAY, ...
    holiday: boolean;
    totalStock: number;
    groups: WeeklyDayGroup[];
    open: boolean;
  }[];
}

/** GET /menus/daily/{storeId}/groups?date= 응답의 그룹 한 개 */
export interface DailyMenuGroupItem {
  id: number;
  name: string;
  sortOrder: number;
  stock: number;
  capacity: number;
  menus: string[];
}

/** GET /menus/daily/{storeId}/groups?date= 응답 (특정 날짜의 그룹 목록 + 재고) */
export interface DailyMenuResponse {
  id: number;
  date: string;       // YYYY-MM-DD
  dayOfWeek: string;  // MONDAY, ...
  totalStock: number;
  groups: DailyMenuGroupItem[];
  open: boolean;
  holiday?: boolean;
}

export type ApiEnvelope<T> = {
  data: T;
  result: {
    code: string;
    message: string;
    timestamp: string;
  };
};

export type FrequentMenuGroup = {
  id: string;       // 그룹 식별자
  name: string;     // 그룹 이름 (ex: 아침세트, 점심추천 등)
  items: string[];  // 해당 그룹에 포함된 메뉴
};

/** 메뉴 그룹 특정 날짜 메뉴 upsert 응답 */
export type MenuGroupMenusResponse = {
  id: number;
  groupId: number;
  groupName: string;
  date: string;
  menus: string[];
};