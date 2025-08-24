import { API_BASE } from "../config";
import { http } from "../http";
import type { User } from "@/types/user";

export async function getMe(signal?: AbortSignal): Promise<User> {
  return http<User>(`${API_BASE}/users/me`, {
    method: "GET",
    signal,
  });
}