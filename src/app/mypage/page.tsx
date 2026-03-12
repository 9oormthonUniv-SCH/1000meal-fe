'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AccountDeletionPage() {
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
        <Link
          href="/qa"
          className="rounded-[10px] bg-[#FF6E3F] px-2.5 py-0.5 text-xs font-semibold text-white leading-5"
        >
          자주 묻는 질문
        </Link>
      </header>

      <main className="mx-auto max-w-2xl px-5 pt-8 pb-16 sm:px-10 sm:pt-12">
        <h1 className="text-xl font-semibold text-zinc-900 leading-8 sm:text-2xl">
          계정 삭제 (회원 탈퇴) 안내
        </h1>

        <div className="mt-6 space-y-6">
          {/* 앱 내 탈퇴 방법 */}
          <section className="rounded-2xl bg-stone-50 p-6">
            <h2 className="font-semibold text-zinc-900">앱에서 직접 탈퇴하기</h2>
            <ol className="mt-3 list-decimal list-inside space-y-2 text-sm text-zinc-700 leading-6">
              <li>오늘순밥 앱을 실행합니다.</li>
              <li>하단 탭에서 <strong>마이페이지</strong>로 이동합니다.</li>
              <li><strong>회원탈퇴</strong> 버튼을 누릅니다.</li>
              <li>안내를 확인하고 <strong>탈퇴하기</strong>를 선택하면 즉시 처리됩니다.</li>
            </ol>
          </section>

          {/* 삭제되는 데이터 */}
          <section className="rounded-2xl bg-stone-50 p-6">
            <h2 className="font-semibold text-zinc-900">삭제되는 정보</h2>
            <ul className="mt-3 list-disc list-inside space-y-1 text-sm text-zinc-700 leading-6">
              <li>계정 정보 (이메일, 비밀번호)</li>
              <li>이용 기록 및 QR 스캔 이력</li>
              <li>즐겨찾기, 알림 설정 등 개인 설정</li>
            </ul>
            <p className="mt-3 text-sm text-neutral-500">
              탈퇴 즉시 모든 데이터가 삭제되며, 복구할 수 없습니다.
            </p>
          </section>

          {/* 문의 */}
          <section className="rounded-2xl bg-stone-50 p-6">
            <h2 className="font-semibold text-zinc-900">직접 탈퇴가 어려운 경우</h2>
            <p className="mt-3 text-sm text-zinc-700 leading-6">
              앱 접속이 불가능하거나 기타 사유로 직접 탈퇴가 어려운 경우,
              아래 이메일로 가입 시 사용한 이메일 주소와 함께 삭제를 요청해 주세요.
            </p>
            <p className="mt-2 text-sm font-semibold text-zinc-900">
              📧 jeong01101095@gmail.com
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              요청 접수 후 영업일 기준 3일 이내에 처리됩니다.
            </p>
          </section>
        </div>

        <p className="mt-10 text-center">
          <Link href="/" className="text-[#FF6E3F] text-sm underline-offset-4 hover:underline">
            ← 서비스 소개로 돌아가기
          </Link>
        </p>
      </main>
    </div>
  );
}
