export interface WeeklyMenuResponse {
  storeId: number;
  startDate: string;
  endDate: string;
  dailyMenus: {
    id: number;
    date: string;
    dayOfWeek: string;
    stock: number | null;
    menus: string[];
    open: boolean;
  }[];
}

export type ApiEnvelope<T> = {
  data: T;
  result: {
    code: string;
    message: string;
    timestamp: string;
  };
};