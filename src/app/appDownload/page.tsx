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

export default function AppDownloadPage() {
  return (
    <div className="h-dvh overflow-y-auto bg-white flex flex-col">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-5 pt-4">
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

      {/* 본문 */}
      <main className="flex-1 flex flex-col items-center px-5 pt-16">
        <h1 className="text-center text-lg font-semibold text-zinc-900 leading-7">
          명부 등록을 위해
          <br />
          오늘순밥 <span className="text-[#FF6E3F]">앱 설치</span>가 필요합니다
        </h1>

        {/* 스토어 버튼 */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <StoreButton
            href={APP_STORE_URL}
            icon={<svg className="w-4 h-5" viewBox="0 0 16 19" fill="currentColor"><path d="M13.34 10.05c-.02-2.15 1.75-3.18 1.83-3.23a3.95 3.95 0 00-3.12-1.69c-1.31-.14-2.59.78-3.26.78-.69 0-1.73-.77-2.85-.75a4.2 4.2 0 00-3.54 2.16c-1.52 2.64-.39 6.53 1.08 8.67.73 1.05 1.59 2.22 2.72 2.18 1.1-.04 1.51-.71 2.84-.71 1.31 0 1.69.71 2.83.69 1.18-.02 1.92-1.06 2.63-2.11a8.7 8.7 0 001.2-2.44 3.63 3.63 0 01-2.2-3.35h-.16zM11.28 3.54A3.7 3.7 0 0012.13.5a3.77 3.77 0 00-2.44 1.26 3.53 3.53 0 00-.88 2.95 3.12 3.12 0 002.47-1.17z"/></svg>}
            label="App Store"
          />
          <StoreButton
            href={PLAY_STORE_URL}
            icon={<svg className="w-3.5 h-4" viewBox="0 0 14 16" fill="none"><path d="M.55.53l7.5 7.5-7.5 7.5" stroke="#34A853" strokeWidth="1.5"/><path d="M.55.53L10.05 8 .55 15.53" fill="#FBBC04"/><path d="M10.05 8L13.5 6.5.55.53" fill="#EA4335"/><path d="M10.05 8l3.45 1.5L.55 15.53" fill="#4285F4"/></svg>}
            label="Google Play"
          />
        </div>

        {/* 구분선 */}
        <div className="mt-12 w-64 border-t border-neutral-300" />

        {/* 안내 문구 */}
        <p className="mt-8 text-center text-sm text-neutral-500 leading-5">
          QR 명부 등록은 오늘순밥 앱을 통해 진행됩니다.
          <br />
          앱을 설치하고 천원의 아침밥 실시간 수량과
          <br />
          일주일 메뉴를 간편하게 확인해보세요.
        </p>
      </main>
    </div>
  );
}
