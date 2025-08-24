import type { User } from "@/types/user";
import { API_BASE } from "../config";
import { http } from "../http";

export async function getMe(signal?: AbortSignal): Promise<User> {
  return http<User>(`${API_BASE}/users/me`, {
    method: "GET",
    signal,
  });
}