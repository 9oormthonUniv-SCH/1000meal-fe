'use client';

import { deleteFavorite, getFavoriteGroup, getFavorites, saveFavorite } from "@/lib/api/favorites/endpoints";
import { useEffect, useState } from "react";

export function useFavorites(storeId?: number) {
  const [lists, setLists] = useState<{ id: string; items: string[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!storeId) return;
      try {
        const data = await getFavorites(storeId);
        const mapped = (data.groups ?? []).map(g => ({
          id: g.groupId.toString(),
          items: g.menu,
        }));
        setLists(mapped);
      } catch (err) {
        console.error("API 호출 실패:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [storeId]);

  const loadGroup = async (groupId: string) => {
    try {
      const data = await getFavoriteGroup(Number(groupId));
      return data.groups[0]?.menu ?? [];
    } catch (err) {
      console.error("그룹 상세조회 실패:", err);
      return [];
    }
  };

  const save = async (menus: string[]) => {
    if (!storeId) return;
    try {
      await saveFavorite(storeId, menus);
      const data = await getFavorites(storeId);
      const mapped = (data.groups ?? []).map(g => ({
        id: g.groupId.toString(),
        items: g.menu,
      }));
      setLists(mapped);
    } catch (err) {
      console.error("즐겨찾기 저장 실패:", err);
    }
  };
  
  const remove = async (ids: string[]) => {
    if (!storeId) return;
    try {
      await deleteFavorite(storeId, ids.map(id => Number(id)));
      setLists(prev => prev.filter(l => !ids.includes(l.id)));
    } catch (err) {
      console.error("즐겨찾기 삭제 실패:", err);
    }
  };

  return { lists, loading, save, loadGroup, remove };
}