// app/admin/menu/page.tsx
'use client';

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Header from "@/components/common/Header";
import ActionBar from "@/components/admin/menu/ActionBar";
import PastWeeksSection from "@/components/admin/menu/PastWeeksSection";
import MenuWeekEditor, { DayMenu } from "@/components/admin/menu/MenuWeekEditor";
import PullToAddMenu from "@/components/admin/menu/PullToAddMenu";
import { mondayOf } from "@/utils/week";
import { Plus } from "lucide-react";
import PullIndicator from "@/components/admin/menu/PullIndicator";
dayjs.locale("ko");

function buildWeek(base: dayjs.Dayjs): DayMenu[] {
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
  const [weeks, setWeeks] = useState<DayMenu[][]>([]);
  const addCurrentWeek = () => setWeeks(prev => [buildWeek(dayjs()), ...prev]);
  const updateWeek = (i: number, next: DayMenu[]) =>
    setWeeks(prev => prev.map((w, idx) => (idx === i ? next : w)));
  const removeWeek = (i: number) =>
    setWeeks(prev => prev.filter((_, idx) => idx !== i));

  const [pastWeeks, setPastWeeks] = useState<DayMenu[][]>([]);
  const prependPastWeek = () => {
    const baseMonday = pastWeeks.length
      ? mondayOf(dayjs(pastWeeks[0][0].id)).subtract(7, "day")
      : mondayOf(dayjs()).subtract(7, "day");
    const newWeek = buildWeek(baseMonday).map(d => ({
      ...d,
      items: ["김치볶음밥", "계란후라이"],
    }));
    setPastWeeks(prev => [newWeek, ...prev]);
  };

  return (
    <div className="w-full min-h-dvh bg-[#F5F6F7] flex flex-col">
      <Header title="메뉴 관리" />
      <ActionBar onClickFavorite={() => { /* TODO */ }} />

      <PullToAddMenu
        onRefresh={prependPastWeek}
        rootId="app-main"
        renderIndicator={({ progress, phase }) => (
          <PullIndicator progress={progress} phase={phase} />
        )}
      >
        {/* 과거 주차들 */}
        <div className="px-4 space-y-6">
          <PastWeeksSection pastWeeks={pastWeeks} />
        </div>

        {/* 비어있으면 중앙 + 버튼 */}
        {weeks.length === 0 && (
          <div className="pt-6 flex justify-center">
            <button
              onClick={addCurrentWeek}
              className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shadow"
              aria-label="주간 메뉴 추가"
            >
              <Plus className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        )}

        {/* 편집 카드들 */}
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