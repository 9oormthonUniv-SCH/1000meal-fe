// atoms/user.ts
import { getRoleFromToken } from "@/lib/auth/jwt";
import { getSession } from "@/lib/auth/session.client";
import type { MeResponse } from "@/types/user";
import { atom } from "jotai";

export const meAtom = atom<MeResponse | null>(null);
export const storeIdAtom = atom<number | null>(null);

export const userRoleAtom = atom<"STUDENT" | "ADMIN">(() => {
  const { token } = getSession();
  return getRoleFromToken(token); // 항상 토큰에서 role 추출
});