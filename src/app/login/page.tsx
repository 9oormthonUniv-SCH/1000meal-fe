// app/login/page.tsx
'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFailed(false);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // TODO: API 연동
    setLoading(false);
    setFailed(true); // TODO: API 결과로 대체
  };

  return (
    <div className="flex flex-col pt-[56px]">
      <Header title="" />

      <div className="px-5 py-4 flex-1">
        <h1 className="text-2xl font-bold leading-snug mb-3">
          당신의 걸음이<br/>헛되지 않도록,
        </h1>

        <div className="w-28 h-8 rounded mb-6 flex items-center justify-center">
          <img src="/logo.png" alt="오늘 순밥" className="h-8 object-contain" />
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
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
            {failed && (
              <p className="mt-2 text-xs text-red-500">아이디 또는 비밀번호를 확인해주세요.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-orange-500 text-white font-semibold flex items-center justify-center disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '로그인'}
          </button>

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
    </div>
  );
}