'use client';

import { mondayOf } from "@/utils/week";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useEffect, useRef } from "react";
import MenuWeekEditor, { DayMenu } from "./MenuWeekEditor";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

type Props = {
  weeks: DayMenu[][];
  onClickDay: (date: string) => void;
  loadWeek: (date: string, direction: "prev" | "next") => void;
};

function getMonthWeekLabel(dateStr: string) {
  const d = dayjs(dateStr);
  const month = d.month() + 1;
  const firstDayOfMonth = d.startOf("month");
  const firstMonday = firstDayOfMonth.startOf("week").add(1, "day");
  const weekIndex = Math.floor(d.diff(firstMonday, "week")) + 1;
  return `${month}월 ${weekIndex}주차`;
}

export default function WeekList({ weeks, onClickDay, loadWeek }: Props) {
  const today = dayjs();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (weeks.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === bottomRef.current) {
            // ✅ 이미 로딩된 주차는 loadWeek에서 걸러줌
            loadWeek(
              mondayOf(dayjs(weeks[weeks.length - 1][0].id))
                .add(1, "week")
                .format("YYYY-MM-DD"),
              "next"
            );
          }
        });
      },
      { threshold: 1.0, rootMargin: "100px" }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [weeks, loadWeek]);

  return (
    <div className="px-4 space-y-6 pb-[calc(env(safe-area-inset-bottom)+96px)]">
      {weeks.map((week, idx) => {
        const firstDay = week[0].id;
        const mondayId = mondayOf(dayjs(firstDay)).format("YYYY-MM-DD");
        const lastDay = week[week.length - 1].id;

        const isThisWeek =
          today.isSameOrAfter(dayjs(firstDay), "day") &&
          today.isSameOrBefore(dayjs(lastDay), "day");

        const title = isThisWeek ? "이번 주" : getMonthWeekLabel(firstDay);

        return (
          <div key={idx} id={`week-${mondayId}`}>
            <MenuWeekEditor
              title={title}
              week={week}
              onClickDay={onClickDay}
              readOnly={false}
            />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}