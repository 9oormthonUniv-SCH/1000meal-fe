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
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900">공지사항</h2>
        <Link href="/notice" className="text-sm text-gray-500 hover:text-gray-700">
          더보기 &gt;
        </Link>
      </div>

      <div className="flex flex-col gap-4 mx-2">
        {notices.slice(0, 3).map((notice) => (
          <Link href={`/notice/${notice.id}`} key={notice.id}>
            <div className="flex justify-between items-center hover:opacity-90">
              <div className="text-sm text-gray-800 font-medium">{notice.title}</div>
              {notice.isNew && (
                <div className="ml-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full text-center leading-5 font-bold">
                  N
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1">{notice.date}</div>
            <div className="border-b mt-2 border-gray-200" />
          </Link>
        ))}
      </div>
    </div>
  );
}