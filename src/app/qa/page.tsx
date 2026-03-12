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
    q: '오늘순밥은 누구나 이용할 수 있나요?',
    a: '오늘순밥은 순천향대학교 재학생을 위한 서비스입니다. 안전한 명부 관리를 위해, 회원가입 시 순천향대학교 웹메일로 재학생 인증을 받고 있습니다.',
  },
  {
    id: 3,
    q: 'QR코드는 어떻게 사용하나요?',
    a: '앱 내 카메라로 매장에 비치된 QR코드를 스캔하면 명부 등록 및 수량 차감 등이 연동됩니다.',
  },
  {
    id: 4,
    q: 'QR코드를 스캔할 수 없어요.',
    a: '카메라 고장, 학교 메일 인증 불가 등으로 QR 스캔이 어려운 경우 매장 관리자에게 알린 후, 매장에 비치된 수기 명부를 작성해 주세요.',
  },
  {
    id: 5,
    q: '실수로 QR코드를 스캔했어요.',
    a: 'QR 스캔은 천원의 아침밥 이용 및 결제 시에만 진행해 주세요. 실수로 스캔한 경우 매장 관리자에게 문의해 주세요.',
  },
  {
    id: 6,
    q: '문의는 어디로 하면 되나요?',
    a: '오늘순밥 이메일(jeong01101095@gmail.com) 또는 인스타그램(@todaysoonbab)으로 문의해 주시면 됩니다.',
  },
  {
    id: 7,
    q: '회원을 탈퇴하고 싶어요.',
    a: '앱 내 마이페이지에서 회원 탈퇴를 진행할 수 있습니다. 탈퇴 시 모든 기록이 삭제되며, 탈퇴 후에는 동일 계정으로 재가입이 필요할 수 있습니다.',
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

        {/* 모바일: 아코디언 (details/summary) */}
        <div className="mt-6 space-y-3 sm:hidden">
          {QA_LIST.map((item) => (
            <details key={item.id} className="group rounded-2xl bg-stone-50">
              <summary className="flex items-center gap-2 p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="text-lg font-semibold text-blue-400 leading-7 flex-shrink-0">Q{item.id}.</span>
                <span className="flex-1 min-w-0 text-base font-semibold text-zinc-900 leading-6 break-keep">{item.q}</span>
                <svg
                  className="w-5 h-5 flex-shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-sm text-zinc-700 leading-relaxed break-keep">{item.a}</p>
            </details>
          ))}
        </div>

        {/* PC: 2열 레이아웃 (질문 왼쪽, 답변 오른쪽) */}
        <ul className="mt-10 hidden sm:block space-y-8">
          {QA_LIST.map((item) => (
            <li key={item.id} className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-[280px] lg:w-[320px]">
                <p className="text-lg font-semibold text-blue-400 leading-7">Q{item.id}.</p>
                <h2 className="mt-1 text-lg font-semibold text-zinc-900 leading-7">{item.q}</h2>
              </div>
              <div className="flex-1 min-w-0 rounded-2xl bg-stone-50 p-6">
                <p className="text-sm text-zinc-900 leading-relaxed break-keep">{item.a}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
