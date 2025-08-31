'use client';

import type { DayOfWeek, StoreDetail } from "@/types/store";
import { motion } from "framer-motion";
import { useMemo } from "react";
import MenuCard from "./MenuCard";

interface WeeklyMenuProps {
  store: StoreDetail;
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

const WEEKDAYS: DayOfWeek[] = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"];

export default function WeeklyMenu({ store }: WeeklyMenuProps) {
  const todayISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // 1) 월~금만 골라 날짜 오름차순으로 정렬
  const weekdayMenus = useMemo(() => {
    const list = store?.weeklyMenuResponse?.dailyMenus ?? [];
    return list
      .filter(d => WEEKDAYS.includes(d.dayOfWeek))
      .sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [store?.weeklyMenuResponse?.dailyMenus]);

  return (
    <div className="px-4 pt-4">
      <h2 className="text-2xl font-semibold mb-3">일주일 메뉴</h2>

      <motion.div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-x-5 w-max px-1">
          {weekdayMenus.map((d) => {
            const isToday = d.date === todayISO;
            const dateLabel = `${d.date.slice(5, 7)}월 ${d.date.slice(8, 10)}일`; // MM월 DD일
            const dayLabel = KOR_DAY_LABEL[d.dayOfWeek];

            // 영업 안 하는 날 표시 커스터마이즈 가능
            const items = d.open ? d.menus : ["휴무"];

            return (
              <div key={d.id} className="flex-shrink-0 w-[140px]">
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

      <div className="text-sm text-left mt-4 text-orange-500 font-medium">
        남은 수량 : {store?.remain ?? 0}개
      </div>
    </div>
  );
}