import type { MeResponse } from "@/types/user";
import { atom } from "jotai";

export const meAtom = atom<MeResponse | null>(null);

// meAtom 기반 파생 아톰들
export const userRoleAtom = atom((get) => get(meAtom)?.role ?? "STUDENT");
export const storeIdAtom = atom((get) => get(meAtom)?.storeId ?? null);