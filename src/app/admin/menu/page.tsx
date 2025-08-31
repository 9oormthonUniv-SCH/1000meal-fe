'use client';

import { storeIdAtom } from "@/atoms/user";
import ActionBar from "@/components/admin/menu/ActionBar";
import PullIndicator from "@/components/admin/menu/PullIndicator";
import PullToAddMenu from "@/components/admin/menu/PullToAddMenu";
import RangeCalendarModal from "@/components/admin/menu/RangeCalendarModal";
import WeekList from "@/components/admin/menu/WeekList";
import Header from "@/components/common/Header";
import { useWeeklyMenus } from "@/lib/hooks/useWeeklyMenus";
import { mondayOf } from "@/utils/week";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminMenuPage() {
  const storeId = useAtomValue(storeIdAtom);
  const today = dayjs().format("YYYY-MM-DD");
  const { weeks, loadWeek } = useWeeklyMenus(storeId ?? undefined, today);

  const [showCalendar, setShowCalendar] = useState(false);
  const router = useRouter();

  const handleEdit = (date: string) => {
    router.push(`/admin/menu/edit/${date}`);
  };

  return (
    <div className="w-full min-h-dvh bg-[#F5F6F7] flex flex-col pt-[56px]">
      <Header title="메뉴 관리" onBack={() => router.push("/admin")} />
      <ActionBar
        onClickCalendar={() => setShowCalendar(true)}
        onClickFavorite={() => router.push("/admin/menu/frequent")}
      />

      <PullToAddMenu
        onRefresh={() => {
          if (weeks.length > 0 && weeks[0].length > 0) {
            loadWeek(
              mondayOf(dayjs(weeks[0][0].id)).subtract(1, "week").format("YYYY-MM-DD"),
              "prev"
            );
          }
        }}
        onReachEnd={() => {
          if (weeks.length > 0 && weeks[weeks.length - 1].length > 0) {
            loadWeek(
              mondayOf(dayjs(weeks[weeks.length - 1][0].id)).add(1, "week").format("YYYY-MM-DD"),
              "next"
            )
          }
        }}
        rootId="app-main"
        renderIndicator={({ progress, phase }) => (
          <PullIndicator progress={progress} phase={phase} />
        )}
      >
        <WeekList weeks={weeks} onClickDay={handleEdit} loadWeek={loadWeek} />
      </PullToAddMenu>

      {showCalendar && (
        <RangeCalendarModal
          onClose={() => setShowCalendar(false)}
          onConfirm={({ start }) => {
            // 📌 선택된 날짜 기준으로 강제로 로딩
            loadWeek(start, "next");
          }}
        />
      )}
    </div>
  );
}