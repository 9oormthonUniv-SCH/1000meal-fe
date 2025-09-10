'use client';

import Header from '@/components/common/Header';
import { ApiError } from '@/lib/api/errors';
import { createNotice } from '@/lib/api/notices/endpoints'; // ✅ 서버 API (추가 필요)
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewNoticePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrMsg('제목과 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    setErrMsg(null);

    try {
      await createNotice({ title, content });
      router.replace('/notice'); // 작성 완료 후 목록으로 이동
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        setErrMsg(e.message);
      } else {
        setErrMsg('공지 등록에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden pt-[56px]">
      <Header title="공지 작성" onBack={() => router.back()} />
      <div className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {errMsg && <p className="text-sm text-red-500">{errMsg}</p>}

          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-md min-h-[150px] focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? '등록 중…' : '등록하기'}
          </button>
        </form>
      </div>
    </div>
  );
}