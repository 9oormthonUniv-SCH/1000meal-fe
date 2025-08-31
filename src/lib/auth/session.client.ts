// src/lib/auth/session.ts
import Cookies from "js-cookie";

const TOKEN_KEY = "accessToken";
const ROLE_KEY = "role";

export function setSession(token: string, role: "user" | "admin") {
  Cookies.set(TOKEN_KEY, token, { secure: true, sameSite: "strict" });
  Cookies.set(ROLE_KEY, role, { secure: true, sameSite: "strict" });
}

export function getSession() {
  const token = Cookies.get(TOKEN_KEY) ?? null;
  const role = (Cookies.get(ROLE_KEY) as "user" | "admin" | null) ?? null;
  return { token, role };
}

export function clearSession() {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
}