import { DayMenu } from "@/components/admin/menu/MenuWeekEditor";
import { getWeeklyMenu } from "@/lib/api/menus/endpoints";
import { WeeklyMenuResponse } from "@/types/menu";
import { mondayOf } from "@/utils/week";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const loadedWeeksRef = useRef<Set<string>>(new Set());

  const loadWeek = useCallback(
    async (baseDate: string, direction: "prev" | "next", force = false) => {
      if (!storeId) return;
      try {
        const mondayId = dayjs(baseDate).startOf("week").add(1, "day").format("YYYY-MM-DD");
        if (!force && loadedWeeksRef.current.has(mondayId)) return;

        const res = await getWeeklyMenu(storeId, baseDate);

        const week =
          res.dailyMenus.length > 0
            ? buildWeekFromApi(res.dailyMenus)
            : buildEmptyWeek(dayjs(baseDate));

        setWeeks((prev) => {
          if (direction === "next") return [...prev, week];
          if (direction === "prev") return [week, ...prev];
          return prev;
        });

        loadedWeeksRef.current.add(mondayId);
      } catch (err) {
        console.error("주차 불러오기 실패:", err);
        const emptyWeek = buildEmptyWeek(dayjs(baseDate));
        setWeeks((prev) =>
          direction === "next" ? [...prev, emptyWeek] : [emptyWeek, ...prev]
        );
      }
    },
    [storeId]
  );

  useEffect(() => {
    if (!storeId) return;
  
    const start = initialDate ?? dayjs().format("YYYY-MM-DD");
    const mondayId = mondayOf(dayjs(start)).format("YYYY-MM-DD");
  
    if (loadedWeeksRef.current.size === 0) {
      loadWeek(mondayId, "next", true);
    }
  }, [storeId, initialDate, loadWeek]);

  return { weeks, loadWeek };
}