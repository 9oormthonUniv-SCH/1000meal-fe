'use client';

import { Notice } from '@/types/notice';
import Link from 'next/link';

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
            {/* createdAt 같은 필드를 변환해서 쓰는 게 좋아요 */}
            <div className="text-xs text-gray-400 mt-1">
              {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
            </div>
            <div className="border-b mt-2 border-gray-200" />
          </div>
        </Link>
      ))}
    </div>
  );
}