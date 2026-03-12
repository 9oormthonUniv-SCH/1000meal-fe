'use client';

import Image from 'next/image';
import Link from 'next/link';

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || '';
const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL || '';

function StoreButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const disabled = !href;
  const className =
    'flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-500 transition' +
    (disabled ? ' opacity-40 cursor-not-allowed' : ' hover:border-neutral-400');

  if (disabled) {
    return (
      <span className={className} title="준비 중">
        {icon}
        {label}
        <span className="text-[10px] text-neutral-400 font-normal">(준비 중)</span>
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {icon}
      {label}
    </a>
  );
}

const AppleIcon = () => (
  <svg className="w-4 h-5" viewBox="0 0 16 19" fill="currentColor"><path d="M13.34 10.05c-.02-2.15 1.75-3.18 1.83-3.23a3.95 3.95 0 00-3.12-1.69c-1.31-.14-2.59.78-3.26.78-.69 0-1.73-.77-2.85-.75a4.2 4.2 0 00-3.54 2.16c-1.52 2.64-.39 6.53 1.08 8.67.73 1.05 1.59 2.22 2.72 2.18 1.1-.04 1.51-.71 2.84-.71 1.31 0 1.69.71 2.83.69 1.18-.02 1.92-1.06 2.63-2.11a8.7 8.7 0 001.2-2.44 3.63 3.63 0 01-2.2-3.35h-.16zM11.28 3.54A3.7 3.7 0 0012.13.5a3.77 3.77 0 00-2.44 1.26 3.53 3.53 0 00-.88 2.95 3.12 3.12 0 002.47-1.17z"/></svg>
);

const PlayIcon = () => (
  <svg className="w-3.5 h-4" viewBox="0 0 14 16" fill="none"><path d="M.55.53l7.5 7.5-7.5 7.5" stroke="#34A853" strokeWidth="1.5"/><path d="M.55.53L10.05 8 .55 15.53" fill="#FBBC04"/><path d="M10.05 8L13.5 6.5.55.53" fill="#EA4335"/><path d="M10.05 8l3.45 1.5L.55 15.53" fill="#4285F4"/></svg>
);

function StoreButtons() {
  return (
    <>
      {/* PC: 가로 배치 */}
      <div className="hidden sm:flex items-center gap-4">
        <StoreButton href={APP_STORE_URL} icon={<AppleIcon />} label="App Store" />
        <StoreButton href={PLAY_STORE_URL} icon={<PlayIcon />} label="Google Play" />
      </div>
      {/* 모바일: 세로 배치 */}
      <div className="flex flex-col items-center gap-3 sm:hidden">
        <StoreButton href={APP_STORE_URL} icon={<AppleIcon />} label="App Store" />
        <StoreButton href={PLAY_STORE_URL} icon={<PlayIcon />} label="Google Play" />
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <div className="relative h-dvh">
      {/* ── 고정 배경 레이어 (그라데이션 + Union.svg) ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #FFFFFF 0%, #FFA588 100%)',
        }}
      >
        <div className="absolute bottom-[20%] left-[65%] -translate-x-1/2 sm:left-1/2">
          <Image
            src="/Union.svg"
            alt=""
            width={571}
            height={544}
            className="w-[85vw] max-w-[500px]"
            priority
          />
        </div>
      </div>

      {/* ── 고정 헤더 (로고 + 자주 묻는 질문) ── */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-5 pt-4 sm:px-10 sm:pt-6">
        <Link href="/">
          <Image
            src="/Textlogo.png"
            alt="오늘순밥"
            width={103}
            height={25}
            className="h-6 w-auto object-contain"
          />
        </Link>
        <Link
          href="/qa"
          className="rounded-[10px] bg-[#FF6E3F] px-2.5 py-0.5 text-xs font-semibold text-white leading-5"
        >
          자주 묻는 질문
        </Link>
      </header>

      {/* ── 스크롤 콘텐츠 ── */}
      <main className="relative z-10 h-dvh overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        {/* 섹션 1: 히어로 콘텐츠 (배경 투명 → 고정 배경이 보임) */}
        <section className="snap-start h-dvh flex flex-col px-4 pt-20 pb-8 sm:pt-24 sm:pb-12">
          {/* 상단 콘텐츠 */}
          <div className="flex-1 flex flex-col items-center pt-6 sm:pt-10">
            <h1 className="text-center text-3xl font-semibold text-zinc-900 leading-[1.35] sm:text-4xl lg:text-5xl">
              당신의 걸음이
              <br />
              헛되지 않도록,
              <br />
              <span className="relative">
                오늘순밥
                <span className="absolute left-0 bottom-0 w-full h-1.5 bg-orange-300 -z-10" />
              </span>
            </h1>

            <div className="mt-8">
              <StoreButtons />
            </div>
          </div>

          {/* 하단 CTA */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-center text-xs text-neutral-500 leading-4">
              순천향대학교 천원의 아침밥 실시간 수량 확인 서비스
            </p>
            <p className="text-xs font-semibold text-neutral-700 leading-4">더 알아보기</p>
            <div className="mt-2 flex flex-col items-center animate-bounce-down">
              <Image src="/downArrow.svg" alt="" width={40} height={19} />
              <Image
                src="/downArrow.svg"
                alt=""
                width={40}
                height={19}
                className="-mt-1"
                style={{ filter: 'brightness(0) saturate(100%) invert(37%) sepia(82%) saturate(1000%) hue-rotate(342deg) brightness(100%) contrast(100%)' }}
              />
            </div>
          </div>
        </section>

        {/* 섹션 2: 서비스 소개 */}
        <section className="snap-start min-h-dvh  px-5 pt-16 pb-16 sm:px-10 sm:pt-20 sm:pb-20">
          <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
            {/* 카드 1: 홈·지도 */}
            <article className="rounded-2xl bg-white p-6 sm:p-10 text-center">
              <p className="text-xs font-semibold text-[#FF6E3F] leading-5">홈 · 지도</p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-900 leading-8 sm:text-2xl">
                필요한 정보를 한눈에
              </h2>
              <div className="mt-4 flex justify-center">
                <Image src="/Graphic1.png" alt="지도와 시계" width={160} height={140} className="h-28 w-auto sm:h-36 object-contain" />
              </div>
              <p className="mt-4 text-xs text-zinc-900 leading-4 sm:text-sm">
                가게별 남은 수량을 실시간으로 확인하고
                <br />
                나와 가까운 가게를 찾아가요
              </p>
            </article>

            {/* 카드 2: 가게별 상세 */}
            <article className="rounded-2xl bg-white p-6 sm:p-10 text-center">
              <p className="text-xs font-semibold text-[#FF6E3F] leading-5">가게별 상세페이지</p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-900 leading-8 sm:text-2xl">
                메뉴를 미리 확인
              </h2>
              <div className="mt-4 flex justify-center">
                <Image src="/Graphic2.png" alt="커피와 햄버거" width={160} height={140} className="h-28 w-auto sm:h-36 object-contain" />
              </div>
              <p className="mt-4 text-xs text-zinc-900 leading-4 sm:text-sm">
                일주일 메뉴를 미리 확인하고
                <br />
                영업 정보를 확인하세요
              </p>
            </article>

            {/* 카드 3: QR */}
            <article className="rounded-2xl bg-white p-6 sm:p-10 text-center">
              <p className="text-xs font-semibold text-[#FF6E3F] leading-5">큐알</p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-900 leading-8 sm:text-2xl">
                QR로 간편하게
              </h2>
              <div className="mt-4 flex justify-center">
                <Image src="/Graphic3.png" alt="QR 카드" width={160} height={140} className="h-28 w-auto sm:h-36 object-contain" />
              </div>
              <p className="mt-4 text-xs text-zinc-900 leading-4 sm:text-sm">
                QR 코드로 빠르게 명부를 등록해
                <br />
                천원의 아침밥을 더 간편하게 이용하세요
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
