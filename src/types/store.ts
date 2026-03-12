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

/** /api/v1/stores 응답: todayMenu.menuGroups 항목 */
export type TodayMenuGroup = {
  id: number;
  name: string;
  sortOrder: number;
  capacity: number;
  stock: number;
  menus: Array<{ id: number; name: string }>;
  default?: boolean;
};

/** 목록 아이템: /api/v1/stores, /api/v1/stores/list */
export type StoreListItem = {
  id: number;
  imageUrl?: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  hours: string;
  /** @deprecated 표시용 재고는 todayMenu.menuGroups[].stock 사용 */
  remain?: number;
  lat: number;
  lng: number;
  todayMenu: {
    id: number;
    date: string;
    dayOfWeek: DayOfWeek;
    menuGroups: TodayMenuGroup[];
    open: boolean;
    holiday?: boolean;
  } | null;
  open: boolean;
  holiday?: boolean;
};

/** 상세: /api/v1/stores/{id} - 주간 메뉴의 하루 그룹 */
export type StoreDetailDayGroup = {
  groupId: number;
  name: string;
  sortOrder: number;
  stock: number;
  capacity: number;
  menus: string[];
};

/** 상세: /api/v1/stores/{id} */
export type StoreDetail = {
  id: number;
  imageUrl?: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  openTime: { hour: number; minute: number; second: number; nano: number };
  closeTime: { hour: number; minute: number; second: number; nano: number };
  /** @deprecated 표시용 재고는 weeklyMenuResponse.dailyMenus(오늘).groups[].stock 사용 */
  remain?: number;
  hours: string;
  lat: number;
  lng: number;
  weeklyMenuResponse: {
    storeId: number;
    startDate: string;
    endDate: string;
    dailyMenus: Array<{
      id: number;
      date: string;
      dayOfWeek: DayOfWeek;
      holiday?: boolean;
      totalStock?: number;
      groups: StoreDetailDayGroup[];
      open: boolean;
    }>;
  };
  open: boolean;
  holiday?: boolean;
};