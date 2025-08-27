// atoms/user.ts
import type { MeResponse } from "@/types/user";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const meAtom = atom<MeResponse | null>(null);

// storeId만 따로 꺼내쓰고 싶으면 selector atom
export const storeIdAtom = atomWithStorage<number | null>("storeId", null);