import type { MeResponse } from "@/types/user";
import { API_BASE } from "../config";
import { http } from "../http";

/** 내 정보 조회 */
export async function getMe(token: string) {
  return http<MeResponse>(`${API_BASE}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}