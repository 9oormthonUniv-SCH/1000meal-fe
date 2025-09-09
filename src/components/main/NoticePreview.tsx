'use client';

import Link from 'next/link';

interface Notice {
  id: string;
  title: string;
  date: string;
  isNew?: boolean;
}

interface Props {
  notices: Notice[];
}

export default function NoticePreview({ notices }: Props) {
  return (
    <div className="my-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">공지사항</h2>
        <Link
          href="/notice"
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          더보기 &gt;
        </Link>
      </div>

      <div className="flex flex-col gap-5">
        {notices.slice(0, 3).map((notice) => (
          <Link href={`/notice/${notice.id}`} key={notice.id}>
            <div className="hover:opacity-90">
              <div className="text-base text-gray-500 font-medium leading-relaxed">
                {notice.title}
              </div>
              <div className="text-sm text-gray-500">{notice.date}</div>
              <div className="border-b mt-3 border-gray-300" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}