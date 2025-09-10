'use client';

import Header from "@/components/common/Header";
import { getNoticeDetail } from "@/lib/api/notices/endpoints";
import { useApiWithParams } from "@/lib/hooks/useApi";
import type { Notice } from "@/types/notice";
import { use } from "react";

export default function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const noticeId = Number(id);

  const { data: notice, loading, error } = useApiWithParams<Notice, number>(
    getNoticeDetail,
    noticeId,
    { enabled: Number.isFinite(noticeId) }
  );

  if (loading) return <p className="pt-[56px] px-4">불러오는 중…</p>;
  if (error || !notice) return <p className="pt-[56px] px-4 text-red-500">공지사항을 불러올 수 없습니다.</p>;

  return (
    <div className="w-full overflow-hidden pt-[56px]">
      <Header title="공지사항" />
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-xl font-bold mb-2">{notice.title}</h1>
        <p className="text-xs text-gray-400 mb-4">{new Date(notice.createdAt).toLocaleString()}</p>
        <div className="text-sm text-gray-700 whitespace-pre-wrap">
          {notice.content || "상세 내용이 없습니다."}
        </div>
      </div>
    </div>
  );
}