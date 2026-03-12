import { http } from "../http";

export type FcmPlatform = "WEB";

export type FcmPreferences = {
  enabled: boolean;
};

const DEFAULT_FCM_API_ORIGIN = "https://1000meal.shop";
const FCM_API_ORIGIN = (process.env.NEXT_PUBLIC_FCM_API_URL || DEFAULT_FCM_API_ORIGIN).replace(/\/$/, "");
const BASE = `${FCM_API_ORIGIN}/api/v1/fcm`;

export async function registerFcmToken(payload: { token: string; platform: FcmPlatform }) {
  return http(`${BASE}/tokens`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getFcmPreferences(signal?: AbortSignal) {
  return http<FcmPreferences>(`${BASE}/preferences`, {
    method: "GET",
    signal,
  });
}

export function updateFcmPreferences(payload: { enabled: boolean }) {
  return http(`${BASE}/preferences`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

