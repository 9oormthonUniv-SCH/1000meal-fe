'use client';

import Image from 'next/image';
import Link from 'next/link';

const QA_LIST = [
  {
    id: 1,
    q: '서비스는 어디서 이용하나요?',
    a: '오늘 순밥 서비스는 웹이 아닌 앱에서 이용해 주세요. 앱을 설치하시면 천원의 아침밥 실시간 수량, 일주일 메뉴, 매장 알림, QR 인식 등 모든 기능을 사용하실 수 있습니다.',
  },
  {
    id: 2,
    q: 'QR코드는 어떻게 사용하나요?',
    a: '앱 내 카메라로 매장에 비치된 QR코드를 스캔하면 명부 등록 및 수량 차감 등이 연동됩니다.',
  },
  {
    id: 3,
    q: 'QR코드를 스캔할 수 없는 경우에는 어떻게 하나요?',
    a: '카메라 고장, 학교 메일 인증 불가 등으로 QR 스캔이 어려운 경우 매장 관리자에게 알린 후, 매장에 비치된 수기 명부를 작성해 주세요.',
  },
  {
    id: 4,
    q: '실수로 QR코드를 스캔했어요.',
    a: 'QR 스캔은 천원의 아침밥 이용 및 결제 시에만 진행해 주세요. 실수로 스캔한 경우 매장 관리자에게 문의해 주세요.',
  },
  {
    id: 5,
    q: '문의는 어디로 하면 되나요?',
    a: '오늘순밥 이메일(@gmail.com) 또는 인스타그램(@작성예정)으로 문의해 주시면 됩니다.',
  },
];

export default function QAPage() {
  return (
    <div className="h-dvh overflow-y-auto bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-5 pt-4 sm:px-10 sm:pt-6">
        <Link href="/">
          <Image
            src="/Textlogo.png"
            alt="오늘순밥"
            width={103}
            height={25}
            className="h-6 w-auto object-contain"
          />
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-5 pt-6 pb-12 sm:px-10 sm:pt-10 sm:pb-20">
        <h1 className="text-xl font-semibold text-zinc-900 leading-8 sm:text-2xl">
          자주 묻는 질문
        </h1>

        {/* 모바일: 카드 세로 리스트 */}
        <ul className="mt-6 space-y-4 sm:hidden">
          {QA_LIST.map((item) => (
            <li key={item.id} className="rounded-2xl bg-stone-50 p-6">
              <p className="text-lg font-semibold text-blue-400 leading-7">Q{item.id}.</p>
              <h2 className="mt-1 text-lg font-semibold text-zinc-900 leading-7">{item.q}</h2>
              <p className="mt-3 text-sm text-zinc-900 leading-5">{item.a}</p>
            </li>
          ))}
        </ul>

        {/* PC: 2열 레이아웃 (질문 왼쪽, 답변 오른쪽) */}
        <ul className="mt-10 hidden sm:block space-y-8">
          {QA_LIST.map((item) => (
            <li key={item.id} className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-[280px] lg:w-[320px]">
                <p className="text-lg font-semibold text-blue-400 leading-7">Q{item.id}.</p>
                <h2 className="mt-1 text-lg font-semibold text-zinc-900 leading-7">{item.q}</h2>
              </div>
              <div className="flex-1 rounded-2xl bg-stone-50 p-6">
                <p className="text-sm text-zinc-900 leading-5">{item.a}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
