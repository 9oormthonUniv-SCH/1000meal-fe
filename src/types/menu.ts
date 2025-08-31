// types/menu.ts
export interface WeeklyMenuResponse {
  storeId: number;
  startDate: string;
  endDate: string;
  dailyMenus: {
    id: number;
    date: string;      // YYYY-MM-DD
    dayOfWeek: string; // 월, 화, ...
    stock: number | null | undefined;
    menus: string[];
    open: boolean;
  }[];
}

export interface DailyMenuResponse {
  id: number;
  date: string;       // YYYY-MM-DD
  dayOfWeek: string;  // MONDAY, TUESDAY ...
  stock: number | null | undefined;
  menus: string[];
  open: boolean;
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