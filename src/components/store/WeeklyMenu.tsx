'use client';

import MenuCard from "./MenuCard";
import { Store } from "@/types/store";
import { useMemo } from "react";
import { motion } from "framer-motion";

interface WeeklyMenuProps {
  store: Store;
}

const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

export default function WeeklyMenu({ store }: WeeklyMenuProps) {
  const today = new Date();
  const todayIndex = today.getDay(); // 0(일) ~ 6(토)
  const todayWeekday = dayNames[todayIndex];
  const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}월 ${String(today.getDate()).padStart(2, '0')}일`;

  const weekdayMenus = useMemo(() => {
    return store.weeklyMenu.slice(0, 5); // ✅ index 0~4 (월~금)
  }, [store.weeklyMenu]);

  return (
    <div className="px-4 pt-4">
      <h2 className="text-2xl font-semibold mb-3">일주일 메뉴</h2>

      <motion.div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-x-5 w-max px-1">
          {weekdayMenus.map((menu, index) => {
            const date = new Date();
            date.setDate(today.getDate() - (todayIndex - (index + 1)));

            const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;
            const day = dayNames[date.getDay()];
            const isToday = formattedDate === todayStr && day === todayWeekday;

            return (
              <div key={index} className="flex-shrink-0 w-[140px]">
                <MenuCard
                  date={formattedDate}
                  day={day}
                  items={menu}
                  selected={isToday}
                />
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="text-sm text-left mt-4 text-orange-500 font-medium">
        남은 수량 : {store.remain}개
      </div>
    </div>
  );
}