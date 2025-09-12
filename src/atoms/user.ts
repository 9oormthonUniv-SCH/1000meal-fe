// src/atoms/user.ts
import { getRoleFromToken, getStoreIdFromToken } from "@/lib/auth/jwt";
import { getSession } from "@/lib/auth/session.client";
import type { MeResponse } from "@/types/user";
import { atom } from "jotai";

// 서버에서 내려준 사용자 정보 저장용
export const meAtom = atom<MeResponse | null>(null);

// 매번 쿠키에서 토큰을 읽고 → 파싱
export const userRoleAtom = atom<"STUDENT" | "ADMIN">(() => {
  const { token } = getSession();
  return getRoleFromToken(token);
});

export const storeIdAtom = atom<number | null>(() => {
  const { token } = getSession();
  return getStoreIdFromToken(token);
});