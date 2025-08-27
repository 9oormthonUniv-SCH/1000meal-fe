'use client';

import Header from '@/components/common/Header';
import { verifyId } from '@/lib/api/auth/endpoints';
import { useSignupDraft } from '@/lib/hooks/useSignupDraft';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignupIdPage() {
  const router = useRouter();
  const { get, set } = useSignupDraft();

  const [id, setId] = useState('');
  const [checking, setChecking] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 기존 드래프트 불러오기
  useEffect(() => {
    const d = get();
    if (d.id) setId(d.id);
  }, [get]);

  // 아이디 변경 처리
  const onChange = async (v: string) => {
    setId(v);
    setOk(null);
    setErrorMsg(null);

    if (/^.{8}$/.test(v)) {  // 숫자 8자리 체크
      setChecking(true);
      try {
        const res = await verifyId(v);
        if (res.valid) {
          setOk(true);
        } else {
          setOk(false);
          setErrorMsg(res.message); // 서버에서 내려준 메시지 출력
        }
      } catch (e) {
        setOk(false);
        setErrorMsg("아이디 확인 중 오류가 발생했습니다.");
      } finally {
        setChecking(false);
      }
    }
  };

  const canNext = ok === true && !checking;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canNext) return;
    set({ id });
    router.push('/signup/credentials');
  };

  return (
    <div className="flex flex-col pt-[56px]">
      <Header title="" />

      <form onSubmit={onSubmit} className="px-5 space-y-8">
        <div>
          <h1 className="text-2xl font-bold leading-snug">
            천밥에 오신 것을<br/>환영합니다!
          </h1>
          <p className="mt-2 text-xs text-gray-500">
            <span className="text-orange-500 font-semibold">1분</span>이면 회원가입 가능해요
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            아이디<span className="text-orange-500">*</span>
          </label>
          <input
            value={id}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border-b border-gray-300 outline-none py-2 focus:border-gray-900"
            placeholder="숫자 8자리를 입력해주세요"
            autoCapitalize="none"
            autoComplete="username"
            required
          />

          {/* 상태 메시지 */}
          {checking && (
            <p className="mt-2 text-xs text-gray-500">중복 확인 중…</p>
          )}
          {ok === false && errorMsg && (
            <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {errorMsg}
            </p>
          )}
          {ok === true && (
            <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 사용가능한 아이디입니다
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canNext}
          className="w-full h-12 rounded-xl bg-orange-500 text-white font-semibold disabled:opacity-40"
        >
          확인
        </button>
      </form>
    </div>
  );
}