'use client';

import { storeIdAtom } from "@/atoms/user";
import ActionBar from "@/components/admin/menu/ActionBar";
import MenuWeekEditor, { DayMenu } from "@/components/admin/menu/MenuWeekEditor";
import PastWeeksSection from "@/components/admin/menu/PastWeeksSection";
import PullIndicator from "@/components/admin/menu/PullIndicator";
import PullToAddMenu from "@/components/admin/menu/PullToAddMenu";
import Header from "@/components/common/Header";
import { getWeeklyMenu } from "@/lib/api/menus/endpoints";
import { WeeklyMenuResponse } from "@/types/menu";
import { mondayOf } from "@/utils/week";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useAtomValue } from "jotai";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

dayjs.locale("ko");

function buildWeekFromApi(dailyMenus: WeeklyMenuResponse["dailyMenus"]): DayMenu[] {
  return dailyMenus.map((d) => {
    const dt = dayjs(d.date);
    return {
      id: dt.format("YYYY-MM-DD"),
      dateLabel: dt.format("MM.DD"),
      weekdayLabel: dt.format("dd"),
      items: d.menus ?? [],
    };
  });
}

function buildEmptyWeek(base: dayjs.Dayjs): DayMenu[] {
  const start = mondayOf(base);
  return Array.from({ length: 5 }).map((_, i) => {
    const dt = start.add(i, "day");
    return {
      id: dt.format("YYYY-MM-DD"),
      dateLabel: dt.format("MM.DD"),
      weekdayLabel: dt.format("dd"),
      items: [],
    };
  });
}

export default function AdminMenuPage() {
  const storeId = useAtomValue(storeIdAtom);
  const [weeks, setWeeks] = useState<DayMenu[][]>([]);
  const [pastWeeks, setPastWeeks] = useState<DayMenu[][]>([]);

  useEffect(() => {
    if (!storeId) return; // 로그인 안됐으면 실행 안 함
    (async () => {
      try {
        const res = await getWeeklyMenu(storeId);
        const week = buildWeekFromApi(res.dailyMenus);
        setWeeks([week]);
      } catch (e) {
        console.error("주간 메뉴 불러오기 실패:", e);
        setWeeks([buildEmptyWeek(dayjs())]);
      }
    })();
  }, [storeId]);

  const addCurrentWeek = () => setWeeks(prev => [buildEmptyWeek(dayjs()), ...prev]);
  const updateWeek = (i: number, next: DayMenu[]) =>
    setWeeks(prev => prev.map((w, idx) => (idx === i ? next : w)));
  const removeWeek = (i: number) =>
    setWeeks(prev => prev.filter((_, idx) => idx !== i));

  const prependPastWeek = () => {
    const baseMonday = pastWeeks.length
      ? mondayOf(dayjs(pastWeeks[0][0].id)).subtract(7, "day")
      : mondayOf(dayjs()).subtract(7, "day");
    const newWeek = buildEmptyWeek(baseMonday).map(d => ({
      ...d,
      items: ["김치볶음밥", "계란후라이"],
    }));
    setPastWeeks(prev => [newWeek, ...prev]);
  };

  return (
    <div className="w-full min-h-dvh bg-[#F5F6F7] flex flex-col pt-[56px]">
      <Header title="메뉴 관리" />
      <ActionBar onClickFavorite={() => {}} />

      <PullToAddMenu
        onRefresh={prependPastWeek}
        rootId="app-main"
        renderIndicator={({ progress, phase }) => (
          <PullIndicator progress={progress} phase={phase} />
        )}
      >
        <div className="px-4 space-y-6">
          <PastWeeksSection pastWeeks={pastWeeks} />
        </div>

        <div className="px-4 space-y-6 pb-[calc(env(safe-area-inset-bottom)+96px)]">
          {weeks.map((week, idx) => (
            <MenuWeekEditor
              key={week[0]?.id ?? idx}
              title={idx === 0 ? "이번 주" : `주간 세트 ${weeks.length - idx}`}
              week={week}
              onChange={(next) => updateWeek(idx, next)}
              onRemove={() => removeWeek(idx)}
              onAddWeekend={() => {}}
            />
          ))}

          {weeks.length > 0 && (
            <div className="py-2 flex justify-center">
              <button
                onClick={addCurrentWeek}
                className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shadow"
                aria-label="주간 메뉴 추가"
              >
                <Plus className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </PullToAddMenu>
    </div>
  );
}