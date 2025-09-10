import { jwtDecode } from "jwt-decode";

export type JwtPayload = {
  sub: string;
  role: "STUDENT" | "ADMIN";
  storeId?: number;
  exp: number;
};

export function getRoleFromToken(token: string | null): "STUDENT" | "ADMIN" {
  if (!token) return "STUDENT"; // 기본값
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.role;
  } catch {
    return "STUDENT";
  }
}

export function getStoreIdFromToken(token: string | null): number | null {
  if (!token) return null;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.storeId ?? null;
  } catch {
    return null;
  }
}