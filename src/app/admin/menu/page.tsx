'use client';

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Header from "@/components/common/Header";
import ActionBar from "@/components/admin/menu/ActionBar";
import PullToReveal from "@/components/admin/menu/PullToReveal";
import PastWeeksSection from "@/components/admin/menu/PastWeeksSection";
import MenuWeekEditor, { DayMenu } from "@/components/admin/menu/MenuWeekEditor";
import { mondayOf } from "@/utils/week";
import { Plus } from "lucide-react";
dayjs.locale("ko");

/** 월~금 5일 카드 생성 */
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
  // 편집 중인 주들
  const [weeks, setWeeks] = useState<DayMenu[][]>([]);
  const addCurrentWeek = () => setWeeks(prev => [buildWeek(dayjs()), ...prev]);
  const updateWeek = (i: number, next: DayMenu[]) =>
    setWeeks(prev => prev.map((w, idx) => (idx === i ? next : w)));
  const removeWeek = (i: number) =>
    setWeeks(prev => prev.filter((_, idx) => idx !== i));

  // 과거 주차 (풀다운으로 쌓임)
  const [pastWeeks, setPastWeeks] = useState<DayMenu[][]>([]);
  const prependPastWeek = () => {
    const baseMonday = pastWeeks.length
      ? mondayOf(dayjs(pastWeeks[0][0].id)).subtract(7, "day")
      : mondayOf(dayjs()).subtract(7, "day");
    const newWeek = buildWeek(baseMonday).map(d => ({
      ...d,
      items: ["김치볶음밥", "계란후라이"], // 임시 데모
    }));
    setPastWeeks(prev => [newWeek, ...prev]);
  };

  return (
    <div className="w-full min-h-dvh bg-[#F5F6F7] flex flex-col">
      <Header title="메뉴 관리" />
      <ActionBar onClickFavorite={() => { /* TODO: 라우팅 */ }} />

      <PullToReveal
        onReveal={prependPastWeek}
        className="px-0 pb-[calc(env(safe-area-inset-bottom)+96px)] space-y-6"
      >
        {/* 과거 주차들 */}
        <PastWeeksSection pastWeeks={pastWeeks} />

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
        <div className="px-4 space-y-6">
          {weeks.map((week, idx) => (
            <MenuWeekEditor
              key={week[0]?.id ?? idx}
              title={idx === 0 ? "이번 주" : `주간 세트 ${weeks.length - idx}`}
              week={week}
              onChange={(next) => updateWeek(idx, next)}
              onRemove={() => removeWeek(idx)}
              onAddWeekend={() => { /* 주말 추가 자리 */ }}
            />
          ))}

          {/* 추가 + 버튼 */}
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
      </PullToReveal>
    </div>
  );
}