'use client'

import Header from '@/components/common/Header';
import NoticeList from '@/components/notice/NoticeList';
import { notices } from '@/constants/mockStores'; // 임시 JSON 또는 서버 API fetch

export default function NoticePage() {
  return (
    <div className="w-full overflow-hidden mt-[56px]">
      <Header title="공지사항"/>
      <div className="max-w-md mx-auto p-4">
        <NoticeList notices={notices} />
      </div>
    </div>
  );
}