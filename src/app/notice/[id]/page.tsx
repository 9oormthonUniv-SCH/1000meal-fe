import Header from '@/components/common/Header';
import { notices } from '@/constants/mockStores';

interface Props {
  params: { id: string };
}

export default function NoticeDetail({ params }: Props) {
  const notice = notices.find((n) => n.id === params.id);

  if (!notice) return <div>공지사항을 찾을 수 없습니다.</div>;

  return (
    <div className="w-full h-dvh overflow-hidden">
      <Header title="공지사항"/>
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-xl font-bold mb-2">{notice.title}</h1>
        <p className="text-xs text-gray-400 mb-4">{notice.date}</p>
        <div className="text-sm text-gray-700 whitespace-pre-wrap">
          {notice.content || '상세 내용이 없습니다.'}
        </div>
      </div>
    </div>
  );
}