// atoms/user.ts
import { getRoleFromToken, getStoreIdFromToken } from "@/lib/auth/jwt";
import { getSession } from "@/lib/auth/session.client";
import type { MeResponse } from "@/types/user";
import { atom } from "jotai";

export const meAtom = atom<MeResponse | null>(null);


const { token } = getSession();

export const userRoleAtom = atom<"STUDENT" | "ADMIN">(() => getRoleFromToken(token));
export const storeIdAtom = atom<number | null>(() => getStoreIdFromToken(token));