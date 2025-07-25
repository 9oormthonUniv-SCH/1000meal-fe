'use client';

import Link from 'next/link';

interface Notice {
  id: string;
  title: string;
  date: string;
}

interface Props {
  notices: Notice[];
}

export default function NoticeList({ notices }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {notices.map((notice) => (
        <Link href={`/notice/${notice.id}`} key={notice.id}>
          <div className="hover:opacity-90">
            <div className="text-sm text-gray-800 font-medium">{notice.title}</div>
            <div className="text-xs text-gray-400 mt-1">{notice.date}</div>
            <div className="border-b mt-2 border-gray-200" />
          </div>
        </Link>
      ))}
    </div>
  );
}