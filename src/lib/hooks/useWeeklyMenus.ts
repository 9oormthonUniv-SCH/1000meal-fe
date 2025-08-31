import { DayMenu } from "@/components/admin/menu/MenuWeekEditor";
import { getWeeklyMenu } from "@/lib/api/menus/endpoints";
import { WeeklyMenuResponse } from "@/types/menu";
import { mondayOf } from "@/utils/week";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

// API → UI 변환
function buildWeekFromApi(dailyMenus: WeeklyMenuResponse["dailyMenus"]): DayMenu[] {
  return dailyMenus.map((d) => {
    const dt = dayjs(d.date);
    return {
      id: dt.format("YYYY-MM-DD"),
      dateLabel: dt.format("MM.DD"),
      weekdayLabel: dt.format("dd"),
      items: d.menus ?? [],
      stock: d.stock ?? undefined,
    };
  });
}

// 📌 월~금만 기본 생성
function buildEmptyWeek(base: dayjs.Dayjs): DayMenu[] {
  const start = base.startOf("week").add(1, "day"); // 월요일
  return Array.from({ length: 5 }).map((_, i) => {
    const dt = start.add(i, "day");
    return {
      id: dt.format("YYYY-MM-DD"),
      dateLabel: dt.format("MM.DD"),
      weekdayLabel: dt.format("dd"),
      items: [],
      stock: undefined,
    };
  });
}

export function useWeeklyMenus(storeId?: number, initialDate?: string) {
  const [weeks, setWeeks] = useState<DayMenu[][]>([]);
  const [loadedWeeks, setLoadedWeeks] = useState<Set<string>>(new Set());

  const loadWeek = async (baseDate: string, direction: "prev" | "next", force = false) => {
    if (!storeId) return;
    try {
      const mondayId = dayjs(baseDate).startOf("week").add(1, "day").format("YYYY-MM-DD");
      if (!force && loadedWeeks.has(mondayId)) return;

      const res = await getWeeklyMenu(storeId, baseDate);

      // ✅ dailyMenus가 비어있으면 빈 주차 생성
      const week =
        res.dailyMenus.length > 0
          ? buildWeekFromApi(res.dailyMenus)
          : buildEmptyWeek(dayjs(baseDate));

      setWeeks((prev) => {
        if (direction === "next") return [...prev, week];
        if (direction === "prev") return [week, ...prev];
        return prev;
      });

      setLoadedWeeks((prev) => new Set(prev).add(mondayId));
    } catch (err) {
      console.error("주차 불러오기 실패:", err);
      // 에러 발생 시에도 빈 주차 표시
      const emptyWeek = buildEmptyWeek(dayjs(baseDate));
      setWeeks((prev) =>
        direction === "next" ? [...prev, emptyWeek] : [emptyWeek, ...prev]
      );
    }
  };

  useEffect(() => {
    if (!storeId) return;
    const start = initialDate ?? dayjs().format("YYYY-MM-DD");
  
    setWeeks([]);
    setLoadedWeeks(new Set());
  
    (async () => {
      // ✅ 이번 주차
      await loadWeek(start, "next", true);
  
      // ✅ 이후 3주차 미리 로딩
      let base = dayjs(start);
      for (let i = 0; i < 3; i++) {
        base = base.add(1, "week"); // ✅ 1주 단위로 이동
        await loadWeek(mondayOf(base).format("YYYY-MM-DD"), "next", true);
      }
    })();
  }, [storeId, initialDate]);

  return { weeks, loadWeek };
}