import { atom } from "jotai";

export const favoriteStoreIdsAtom = atom<number[]>([]);
export const favoriteStoresLoadedAtom = atom<boolean>(false);

