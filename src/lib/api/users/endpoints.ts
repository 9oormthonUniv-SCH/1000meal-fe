import type { MeResponse } from "@/types/user";
import { API_BASE } from "../config";
import { http } from "../http";

/** 내 정보 조회 */
export async function getMe(token: string) {
  console.log("sending token:", token); // 여기 확인
  return http<MeResponse>(`${API_BASE}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}