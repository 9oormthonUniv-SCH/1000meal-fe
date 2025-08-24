// app/signup/terms/page.tsx
'use client';

import Header from '@/components/common/Header';
import { useSearchParams } from 'next/navigation';

export default function TermsPage() {
  const sp = useSearchParams();
  const doc = sp.get('doc'); // 'tos' | 'privacy'

  return (
    <div className="flex flex-col pt-[56px]">
      <Header title="약관" />
      <div className="p-4 space-y-4">
        <h1 className="text-lg font-semibold">
          {doc === 'privacy' ? '개인정보 수집 및 이용 동의' : '이용약관'}
        </h1>
        <div className="text-sm leading-6 text-gray-700 whitespace-pre-wrap">
{`여기에 ${doc === 'privacy' ? '개인정보 처리방침' : '이용약관'} 전문을 넣어주세요.
임시 문구입니다. 추후 마크다운/서버 콘텐츠로 교체 가능합니다.`}
        </div>
      </div>
    </div>
  );
}