'use client';

import PullIndicator from "@/components/admin/menu/PullIndicator";
import PullToAddMenu from "@/components/admin/menu/PullToAddMenu";
import WeekList from "@/components/admin/menu/WeekList";
import Header from "@/components/common/Header";
import { getDailyMenu } from "@/lib/api/menus/endpoints";
import { getCookie } from "@/lib/auth/cookies";
import { getStoreIdFromToken } from "@/lib/auth/jwt";
import { useWeeklyMenus } from "@/lib/hooks/useWeeklyMenus";
import { mondayOf } from "@/utils/week";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminMenuPage() {
  const token = getCookie("accessToken");
  const storeId = getStoreIdFromToken(token);
  const today = dayjs().format("YYYY-MM-DD");

  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!storeId) return;
    (async () => {
      const res = await getDailyMenu(storeId, today);
      const list = res?.groups ?? [];
      setGroups(list);
      if (list.length > 0) {
        setSelectedGroupId((prev) => {
          if (prev == null || !list.some((g) => g.id === prev)) return list[0].id;
          return prev;
        });
      } else {
        setSelectedGroupId(undefined);
      }
    })();
  }, [storeId, today]);

  const { weeks, loadWeek } = useWeeklyMenus(storeId ?? undefined, today, selectedGroupId);

  const router = useRouter();

  const handleEdit = (date: string) => {
    if (selectedGroupId == null) return;
    router.push(`/admin/menu/edit/${date}?groupId=${selectedGroupId}`);
  };

  return (
    <div className="w-full min-h-full bg-[#F5F6F7] flex flex-col pt-[56px]">
      <Header
        title="메뉴 관리"
        onBack={() => router.push("/admin")}
        rightElement={
          <button
            onClick={() => router.push("/admin/menu/frequent")}
            className="text-xs px-3 py-1 rounded-full bg-orange-500 text-white shadow-sm"
          >
            자주 쓰는 메뉴
          </button>
        }
      />

      {groups.length > 1 && (
        <div className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto bg-[#F5F6F7]">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroupId(g.id)}
              className={selectedGroupId === g.id
                ? "px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium whitespace-nowrap"
                : "px-4 py-2 rounded-xl bg-white text-gray-600 text-sm font-medium whitespace-nowrap shadow-sm"}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

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

      
    </div>
  );
}