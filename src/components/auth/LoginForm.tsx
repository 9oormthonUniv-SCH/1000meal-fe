// components/auth/LoginForm.tsx
'use client';

import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type LoginRole = 'STUDENT' | 'ADMIN';

type Props = {
  /** 기본 선택 역할 (기본 user) */
  defaultRole?: LoginRole;
  /** 제출 핸들러. API 연동 시 이쪽에서 호출 */
  onSubmit?: (payload: { role: LoginRole; id: string; pw: string }) => Promise<void> | void;
  /** 제출 중 외부에서 로딩을 제어하고 싶으면 사용 */
  externalLoading?: boolean;
  /** 외부에서 에러 메시지 주입 가능 */
  errorMessage?: string | null;
};

export default function LoginForm({
  defaultRole = 'STUDENT',
  onSubmit,
  externalLoading,
  errorMessage = null,
}: Props) {
  const router = useRouter();

  // 폼 내부 상태
  const [role, setRole] = useState<LoginRole>(defaultRole);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const isLoading = externalLoading ?? loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFailed(false);

    try {
      if (onSubmit) {
        await onSubmit({ role, id, pw });
      } else {
        // 더미 동작 (페이지에서 onSubmit 안 넘긴 경우)
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        setLoading(false);
        setFailed(true);
      }
    } catch {
      setFailed(true);
    }
  };

  return (
    <div className="px-5 py-4 flex-1">
      <h1 className="text-2xl font-bold leading-snug mb-3">
        당신의 걸음이<br />헛되지 않도록,
      </h1>

      <div className="w-28 h-8 rounded mb-6 flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="오늘 순밥"
          width={112}   // 예: 28 * 4 = 112px
          height={32}   // 예: h-8 = 32px
          className="h-8 object-contain"
        />
      </div>

      {/* 역할 토글 */}
      <div className="mb-6">
        <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
          {(['STUDENT', 'ADMIN'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={clsx(
                'px-4 py-1 text-sm rounded-full transition',
                role === r ? 'bg-white shadow text-gray-900' : 'text-gray-500'
              )}
              aria-pressed={role === r}
            >
              {r === 'STUDENT' ? '사용자' : '관리자'}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          현재 선택: <span className="font-medium">{role === 'STUDENT' ? '사용자' : '관리자'}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 아이디 */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">아이디</label>
          <input
            className="w-full border-b border-gray-300 outline-none py-2 focus:border-gray-800"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoCapitalize="none"
            autoComplete="username"
            required
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">비밀번호</label>
          <input
            type="password"
            className="w-full border-b border-gray-300 outline-none py-2 focus:border-gray-800"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="current-password"
            required
          />
          {(failed || errorMessage) && (
            <p className="mt-2 text-xs text-red-500">
              {errorMessage ?? '아이디 또는 비밀번호를 확인해주세요.'}
            </p>
          )}
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-orange-500 text-white font-semibold flex items-center justify-center disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '로그인'}
        </button>

        {/* 하단 링크 */}
        <div className="flex items-center justify-around text-xs text-gray-500 mx-5">
          <button type="button" onClick={() => router.push('/find-id')} className="hover:underline">
            아이디 찾기
          </button>
          <span className="text-gray-300">|</span>
          <button type="button" onClick={() => router.push('/reset-password')} className="hover:underline">
            비밀번호 찾기
          </button>
          <span className="text-gray-300">|</span>
          <button type="button" onClick={() => router.push('/signup/id')} className="hover:underline">
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}