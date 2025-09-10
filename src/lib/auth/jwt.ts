import { jwtDecode } from "jwt-decode";

export type JwtPayload = {
  sub: string;
  role: "STUDENT" | "ADMIN";
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