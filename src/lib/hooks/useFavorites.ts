'use client';

import { createFavorite, deleteFavorite, getFavoriteGroup, getFavorites, updateFavorite } from "@/lib/api/favorites/endpoints";
import { useCallback, useEffect, useState } from "react";

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

  const loadGroup = useCallback(async (groupId: string) => {
    try {
      const data = await getFavoriteGroup(Number(groupId));
      return data.groups[0]?.menu ?? [];
    } catch (err) {
      console.error("그룹 상세조회 실패:", err);
      return [];
    }
  }, []);

  const save = async (menus: string[], groupId?: string) => {
    if (!storeId) return;
    try {
      if (groupId) {
        await updateFavorite(Number(groupId), menus); // 수정
      } else {
        await createFavorite(storeId, menus); // 신규
      }

      // 저장 후 목록 다시 불러오기
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