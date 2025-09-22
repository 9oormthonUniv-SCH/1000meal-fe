// src/atoms/user.ts
import { getRoleFromToken, getStoreIdFromToken } from "@/lib/auth/jwt";
import { getSession } from "@/lib/auth/session.client";
import { atom } from "jotai";

// ✅ 로그인 후 setSession() 호출 시 이 atom을 갱신하도록 함
export const tokenAtom = atom<string | null>(getSession().token);

// ✅ role, storeId는 항상 tokenAtom에 의존 → 토큰 변경 시 자동 갱신
export const userRoleAtom = atom((get) => {
  const token = get(tokenAtom);
  return getRoleFromToken(token);
});

export const storeIdAtom = atom((get) => {
  const token = get(tokenAtom);
  return getStoreIdFromToken(token);
});