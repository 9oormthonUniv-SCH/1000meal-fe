'use client';

import { userRoleAtom } from "@/atoms/user";
import Header from "@/components/common/Header";
import NoticeList from "@/components/notice/NoticeList";
import { getNotices } from "@/lib/api/notices/endpoints";
import { useApi } from "@/lib/hooks/useApi";
import type { Notice } from "@/types/notice";
import { useAtomValue } from "jotai";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NoticePage() {
  const { data: notices = [], loading, error } = useApi<Notice[]>(getNotices, []);
  const role = useAtomValue(userRoleAtom);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full overflow-hidden pt-[56px]">
      <Header
        title="공지사항"
        rightElement={
          mounted && role === "ADMIN" && (
            <button
              onClick={() => router.push("/notice/new")}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="공지 추가"
            >
              <Plus className="w-5 h-5 text-gray-700" />
            </button>
          )
        }
      />

      <div className="max-w-md mx-auto p-4">
        {loading && <p className="text-sm text-gray-500">불러오는 중…</p>}
        {error && <p className="text-sm text-red-500">공지사항을 불러올 수 없습니다.</p>}
        <NoticeList notices={notices} />
      </div>
    </div>
  );
}