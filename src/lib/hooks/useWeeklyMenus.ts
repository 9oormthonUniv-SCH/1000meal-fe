import { DayMenu } from "@/components/admin/menu/MenuWeekEditor";
import { getWeeklyMenu } from "@/lib/api/menus/endpoints";
import { WeeklyMenuResponse, WeeklyDayGroup } from "@/types/menu";
import { mondayOf } from "@/utils/week";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";

function pickGroupForDay(groups: WeeklyDayGroup[], groupId: number | undefined): WeeklyDayGroup | undefined {
  if (!groups.length) return undefined;
  if (groupId == null) return groups[0];
  const g = groups.find((x) => x.groupId === groupId);
  return g ?? groups[0];
}

// API → UI 변환 (그룹별로 해당 그룹 메뉴/재고만 매핑)
function buildWeekFromApi(
  dailyMenus: WeeklyMenuResponse["dailyMenus"],
  groupId: number | undefined
): DayMenu[] {
  return dailyMenus.map((d) => {
    const dt = dayjs(d.date);
    const group = pickGroupForDay(d.groups ?? [], groupId);
    return {
      id: dt.format("YYYY-MM-DD"),
      dateLabel: dt.format("MM.DD"),
      weekdayLabel: dt.format("dd"),
      items: group?.menus ?? [],
      stock: group?.stock ?? undefined,
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

export function useWeeklyMenus(storeId?: number, initialDate?: string, groupId?: number) {
  const [weeks, setWeeks] = useState<DayMenu[][]>([]);
  const loadedWeeksRef = useRef<Set<string>>(new Set());
  /** 주차별 원본 dailyMenus (그룹 변경 시 같은 데이터로 다시 매핑용) */
  const rawWeeksRef = useRef<Map<string, WeeklyMenuResponse["dailyMenus"]>>(new Map());

  const loadWeek = useCallback(
    async (baseDate: string, direction: "prev" | "next", force = false) => {
      if (!storeId) return;
      try {
        const mondayId = dayjs(baseDate).startOf("week").add(1, "day").format("YYYY-MM-DD");
        if (!force && loadedWeeksRef.current.has(mondayId)) return;

        const res = await getWeeklyMenu(storeId, baseDate);
        rawWeeksRef.current.set(mondayId, res.dailyMenus);

        const week =
          res.dailyMenus.length > 0
            ? buildWeekFromApi(res.dailyMenus, groupId)
            : buildEmptyWeek(dayjs(baseDate));

        setWeeks((prev) => {
          const mondayIdStr = mondayOf(dayjs(baseDate)).format("YYYY-MM-DD");
          if (prev.some(w => mondayOf(dayjs(w[0].id)).format("YYYY-MM-DD") === mondayIdStr)) {
            return prev;
          }
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
    [storeId, groupId]
  );

  // 그룹 변경 시 이미 로드된 주차들을 새 groupId로 다시 매핑해 리스트 갱신
  useEffect(() => {
    if (rawWeeksRef.current.size === 0) return;
    const map = rawWeeksRef.current;
    setWeeks((prev) =>
      prev.map((week) => {
        const mondayId = mondayOf(dayjs(week[0].id)).format("YYYY-MM-DD");
        const raw = map.get(mondayId);
        if (!raw?.length) return week;
        return buildWeekFromApi(raw, groupId);
      })
    );
  }, [groupId]);

  useEffect(() => {
    if (!storeId) return;
    const start = initialDate ?? dayjs().format("YYYY-MM-DD");
    const mondayId = mondayOf(dayjs(start)).format("YYYY-MM-DD");
    if (loadedWeeksRef.current.size === 0) {
      loadWeek(mondayId, "next", true);
    }
  }, [storeId, initialDate, groupId, loadWeek]);

  return { weeks, loadWeek };
}