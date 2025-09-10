'use client';

import type { Notice } from "@/types/notice";
import dayjs from "dayjs";
import Link from 'next/link';

interface Props {
  notices: Notice[];
}

export default function NoticePreview({ notices }: Props) {

  return (
    <div className="my-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">공지사항</h2>
        <div className="flex items-center gap-2">
          {/* 관리자일 때만 + 버튼 노출 */}

          <Link
            href="/notice"
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            더보기 &gt;
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {notices.length > 0 ? (
          notices.slice(0, 3).map((notice) => (
            <Link href={`/notice/${notice.id}`} key={notice.id}>
              <div className="hover:opacity-90">
                <div className="text-base text-gray-600 font-medium leading-relaxed">
                  {notice.title}
                </div>
                <div className="text-sm text-gray-400">
                  {dayjs(notice.createdAt).format("YYYY.MM.DD")}
                </div>
                <div className="border-b mt-3 border-gray-300" />
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-400">등록된 공지가 없습니다.</p>
        )}
      </div>
    </div>
  );
}