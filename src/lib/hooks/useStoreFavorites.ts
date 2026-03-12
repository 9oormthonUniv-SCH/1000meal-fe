'use client';

import { favoriteStoreIdsAtom, favoriteStoresLoadedAtom } from "@/atoms/favorites";
import { addFavoriteStore, getFavoriteStores, removeFavoriteStore } from "@/lib/api/favorites/storeFavorites";
import { getCookie } from "@/lib/auth/cookies";
import { useAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";

export function useStoreFavorites() {
  const [ids, setIds] = useAtom(favoriteStoreIdsAtom);
  const [loaded, setLoaded] = useAtom(favoriteStoresLoadedAtom);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = useMemo(() => !!getCookie("accessToken"), []);

  const load = useCallback(async () => {
    if (loaded) return;
    if (!getCookie("accessToken")) return; // 로그인 전이면 로드하지 않음

    setLoading(true);
    try {
      const stores = await getFavoriteStores();
      setIds(stores.map((s) => s.storeId));
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [loaded, setIds, setLoaded]);

  const isFavorite = useCallback(
    (storeId: number) => ids.includes(storeId),
    [ids]
  );

  const toggle = useCallback(
    async (storeId: number) => {
      if (!getCookie("accessToken")) {
        return { ok: false as const, reason: "LOGIN_REQUIRED" as const };
      }

      // 로드 전이면 먼저 로드(최초 토글 시 상태 싱크)
      if (!loaded) {
        try {
          const stores = await getFavoriteStores();
          setIds(stores.map((s) => s.storeId));
          setLoaded(true);
        } catch {
          // ignore
        }
      }

      const currently = ids.includes(storeId);
      // optimistic
      setIds((prev) => (currently ? prev.filter((id) => id !== storeId) : Array.from(new Set([...prev, storeId]))));

      try {
        if (currently) {
          await removeFavoriteStore(storeId);
        } else {
          await addFavoriteStore(storeId);
        }
        return { ok: true as const };
      } catch {
        // rollback
        setIds((prev) => (currently ? Array.from(new Set([...prev, storeId])) : prev.filter((id) => id !== storeId)));
        return { ok: false as const, reason: "API_FAILED" as const };
      }
    },
    [ids, loaded, setIds, setLoaded]
  );

  return { ids, isLoggedIn, loading, load, isFavorite, toggle };
}

