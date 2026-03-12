'use client';

import type { DayOfWeek, StoreDetail, StoreDetailDayGroup } from "@/types/store";
import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import MenuCard from "./MenuCard";

interface WeeklyMenuProps {
  store: StoreDetail;
  onReload?: () => void;
}

const KOR_DAY_LABEL: Record<DayOfWeek, string> = {
  MONDAY: "월요일",
  TUESDAY: "화요일",
  WEDNESDAY: "수요일",
  THURSDAY: "목요일",
  FRIDAY: "금요일",
  SATURDAY: "토요일",
  SUNDAY: "일요일",
};

const WEEKDAYS: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export default function WeeklyMenu({ store, onReload }: WeeklyMenuProps) {
  const todayISO = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  const todayRef = useRef<HTMLDivElement | null>(null);

  const weekdayMenus = useMemo(() => {
    const list = store?.weeklyMenuResponse?.dailyMenus ?? [];
    return list
      .filter((d) => WEEKDAYS.includes(d.dayOfWeek))
      .sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [store?.weeklyMenuResponse?.dailyMenus]);

  /** 그룹 목록 (첫 날 기준, sortOrder 순) */
  const groups = useMemo(() => {
    const first = weekdayMenus[0];
    if (!first?.groups?.length) return [];
    return [...first.groups].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [weekdayMenus]);

  /** 단일 그룹이면 true (기존처럼 한 블록만) */
  const singleGroup = groups.length <= 1;

  useEffect(() => {
    if (todayRef.current && weekdayMenus.length > 0) {
      todayRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [weekdayMenus]);

  const renderDayCards = (group: StoreDetailDayGroup | null) => (
    <motion.div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-x-5 w-max px-1">
        {weekdayMenus.map((d) => {
          const isToday = d.date === todayISO;
          const dateLabel = `${d.date.slice(5, 7)}월 ${d.date.slice(8, 10)}일`;
          const dayLabel = KOR_DAY_LABEL[d.dayOfWeek];
          const items = group
            ? (d.groups?.find((g) => g.groupId === group.groupId)?.menus ?? [])
            : (d.groups?.flatMap((g) => g.menus) ?? []);

          return (
            <div
              key={`${d.date}-${d.dayOfWeek}`}
              className="flex-shrink-0 w-[140px]"
              ref={isToday ? todayRef : null}
            >
              <MenuCard
                date={dateLabel}
                day={dayLabel}
                items={items}
                selected={isToday}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  if (singleGroup) {
    const todayDaily = weekdayMenus.find((d) => d.date === todayISO);
    const singleRemain = todayDaily?.groups?.[0]?.stock ?? store?.remain ?? 0;
    return (
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-semibold">일주일 메뉴</h2>
          <button
            onClick={onReload}
            className="p-2 text-gray-400 hover:text-orange-500 transition"
            aria-label="새로고침"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
        {renderDayCards(null)}
        <div className="text-sm text-left mt-4 text-orange-500 font-medium">
          남은 수량 : {singleRemain}개
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-semibold">일주일 메뉴</h2>
        <button
          onClick={onReload}
          className="p-2 text-gray-400 hover:text-orange-500 transition"
          aria-label="새로고침"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>

      {groups.map((group) => {
        const todayGroup = weekdayMenus.find((d) => d.date === todayISO)?.groups?.find(
          (g) => g.groupId === group.groupId
        );
        const remain = todayGroup?.stock ?? 0;

        return (
          <div key={group.groupId} className="mb-8 last:mb-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{group.name}</h3>
            {renderDayCards(group)}
            <div className="text-sm text-left mt-4 text-orange-500 font-medium">
              남은 수량 : {remain}개
            </div>
          </div>
        );
      })}
    </div>
  );
}