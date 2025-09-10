'use client';

import ActionBar from "@/components/admin/menu/ActionBar";
import PullIndicator from "@/components/admin/menu/PullIndicator";
import PullToAddMenu from "@/components/admin/menu/PullToAddMenu";
import RangeCalendarModal from "@/components/admin/menu/RangeCalendarModal";
import WeekList from "@/components/admin/menu/WeekList";
import Header from "@/components/common/Header";
import { getCookie } from "@/lib/auth/cookies";
import { getStoreIdFromToken } from "@/lib/auth/jwt";
import { useWeeklyMenus } from "@/lib/hooks/useWeeklyMenus";
import { mondayOf } from "@/utils/week";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminMenuPage() {
  const token = getCookie("accessToken");
  const storeId = getStoreIdFromToken(token);
  const today = dayjs().format("YYYY-MM-DD");
  const { weeks, loadWeek } = useWeeklyMenus(storeId ?? undefined, today);

  const [showCalendar, setShowCalendar] = useState(false);
  const router = useRouter();

  const handleEdit = (date: string) => {
    router.push(`/admin/menu/edit/${date}`);
  };

  return (
    <div id="app-main" className="w-full min-h-dvh bg-[#F5F6F7] flex flex-col pt-[56px] overflow-y-auto">
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
          onConfirm={async ({ start }) => {
            const targetMonday = mondayOf(dayjs(start)).format("YYYY-MM-DD");

            let first = mondayOf(dayjs(weeks[0][0].id));
            let last = mondayOf(dayjs(weeks[weeks.length - 1][0].id));
            const target = dayjs(targetMonday);

            const container = document.getElementById("app-main");

            while (target.isBefore(first)) {
              const prevScrollHeight = container?.scrollHeight ?? 0;
            
              // 📌 먼저 한 주 줄이고 나서 로딩
              first = first.subtract(1, "week");
              await loadWeek(first.format("YYYY-MM-DD"), "prev");
            
              if (container) {
                const newScrollHeight = container.scrollHeight;
                container.scrollTop += newScrollHeight - prevScrollHeight;
              }
            }

            while (target.isAfter(last)) {
              const prevScrollHeight = container?.scrollHeight ?? 0;
            
              // 기존 last 에서 새로운 객체 생성
              last = last.add(1, "week");
            
              await loadWeek(last.format("YYYY-MM-DD"), "next");
            
              if (container) {
                const newScrollHeight = container.scrollHeight;
                container.scrollTop += newScrollHeight - prevScrollHeight;
              }
            }

            // 📌 스크롤 이동
            setTimeout(() => {
              document.getElementById(`week-${targetMonday}`)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 200);

            setShowCalendar(false);
          }}
        />
      )}
    </div>
  );
}