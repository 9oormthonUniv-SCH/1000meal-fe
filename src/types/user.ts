export interface MeResponse {
  accountId: number;
  role: "ADMIN" | "STUDENT";
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  storeId: number;
  storeName: string;
}

export interface ApiResponse<T> {
  data: T;
  result: {
    code: string;
    message: string;
    timestamp: string;
  };
}