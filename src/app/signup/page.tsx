// app/signup/page.tsx
'use client';

import { useMemo, useState } from 'react';
import Header from '@/components/common/Header';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [id, setId] = useState(''); // 아이디(이메일/학번 등 백엔드 정책에 맞춰 추후 변경)
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (!name || !id || !pw || !pw2) return false;
    if (pw !== pw2) return false;
    if (!agree) return false;
    return true;
  }, [name, id, pw, pw2, agree]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!canSubmit) return;

    setLoading(true);
    try {
      // TODO: 실제 회원가입 API 연동
      await new Promise((r) => setTimeout(r, 700));
      // 성공 시 로그인으로 이동(또는 자동 로그인 처리)
      router.replace('/login');
    } catch (e: any) {
      setError(e?.message ?? '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col pt-[56px]">
      <Header title="회원가입" />

      <div className="px-5 py-4 flex-1">
        <h1 className="text-2xl font-bold leading-snug mb-6">
          시작은 가볍게,<br/>가입은 간편하게.
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* 이름 */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">이름</label>
            <input
              className="w-full border-b border-gray-300 outline-none py-2 focus:border-gray-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

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
              autoComplete="new-password"
              required
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">비밀번호 확인</label>
            <input
              type="password"
              className="w-full border-b border-gray-300 outline-none py-2 focus:border-gray-800"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              autoComplete="new-password"
              required
            />
            {pw && pw2 && pw !== pw2 && (
              <p className="mt-2 text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          {/* 약관 동의 */}
          <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>
              <span className="text-gray-800">이용약관</span> 및{' '}
              <span className="text-gray-800">개인정보 처리방침</span>에 동의합니다.
            </span>
          </label>

          {/* 에러 */}
          {error && (
            <div className="text-sm text-red-600 border border-red-200 rounded-md p-3 bg-red-50">
              {error}
            </div>
          )}

          {/* 제출 */}
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full h-12 rounded-xl bg-orange-500 text-white font-semibold flex items-center justify-center disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '가입하기'}
          </button>

          {/* 하단 링크 */}
          <div className="text-center text-xs text-gray-500">
            이미 계정이 있으신가요?{' '}
            <button type="button" onClick={() => router.push('/login')} className="underline">
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}