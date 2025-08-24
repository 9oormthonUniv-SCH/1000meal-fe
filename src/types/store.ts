// src/types/store.ts
export type DayOfWeek =
  | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY"
  | "FRIDAY" | "SATURDAY" | "SUNDAY";

export type ApiEnvelope<T> = {
  data: T;
  result: {
    code: string;
    message: string;
    timestamp: string;
  };
};

/** 목록 아이템: /api/v1/stores */
export type StoreListItem = {
  id: number;
  name: string;
  address: string;
  phone: string;
  description: string;
  hours: string;
  remain: number;
  lat: number;
  lng: number;
  todayMenu: {
    id: number;
    date: string;            // YYYY-MM-DD
    dayOfWeek: DayOfWeek;
    menus: string[];
    open: boolean;
  } | null;
  open: boolean;
};

/** 상세: /api/v1/stores/{id} */
export type StoreDetail = {
  id: number;
  name: string;
  address: string;
  phone: string;
  description: string;
  openTime: { hour: number; minute: number; second: number; nano: number };
  closeTime: { hour: number; minute: number; second: number; nano: number };
  remain: number;
  hours: string;
  lat: number;
  lng: number;
  weeklyMenuResponse: {
    storeId: number;
    startDate: string;  // YYYY-MM-DD
    endDate: string;    // YYYY-MM-DD
    dailyMenus: Array<{
      id: number;
      date: string;     // YYYY-MM-DD
      dayOfWeek: DayOfWeek;
      menus: string[];
      open: boolean;
    }>;
  };
  open: boolean;
};

