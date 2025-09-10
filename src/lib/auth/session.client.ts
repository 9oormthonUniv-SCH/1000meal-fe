// session.client.ts
import Cookies from "js-cookie";

const TOKEN_KEY = "accessToken";

export function setSession(token: string) {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7, // 7일
    secure: process.env.NODE_ENV === "production", // 프로덕션에서만 secure
    sameSite: "strict",
    path: "/",
  });
}

export function getSession() {
  return { token: Cookies.get(TOKEN_KEY) ?? null };
}

export function clearSession() {
  Cookies.remove(TOKEN_KEY, { path: "/" });
}