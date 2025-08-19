// app/signup/credentials/page.tsx
'use client';

import Header from '@/components/common/Header';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useSignupDraft } from '@/lib/hooks/useSignupDraft';
import { ChevronRight, AlertCircle } from 'lucide-react';

const pwdRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*().,_-]{8,16}$/;
const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupCredentialsPage() {
  const router = useRouter();
  const { get, set } = useSignupDraft();

  // 초깃값 로드
  useEffect(() => {
    const d = get();
    if (!d.id) {
      // 아이디부터
      router.replace('/signup/id');
    }
  }, [get, router]);


  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [email, setEmail] = useState('');
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTos, setAgreeTos] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(()=>{

  },[pw,pw2,email])
  // 전체 동의 동기화
  useEffect(() => {
    setAgreeAll(agreeTos && agreePrivacy);
  }, [agreeTos, agreePrivacy]);

  const validPwd = useMemo(() => pwdRule.test(pw), [pw]);
  const samePwd  = useMemo(() => pw.length > 0 && pw === pw2, [pw, pw2]);
  const validEmail = useMemo(() => email.length === 0 || emailRule.test(email), [email]);

  const canSubmit = validPwd && samePwd && validEmail && agreeTos && agreePrivacy;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!canSubmit) return;

    // 임시 저장
    set({
      password: pw,
      email: email || undefined,
      agreeTos,
      agreePrivacy,
    });

    // TODO: 본인 인증 → 가입 API 연동
    alert('본인 인증/가입 API 준비 전입니다. 임시로 완료 처리!');
    router.replace('/'); // 홈으로
  };

  return (
    <div className="flex flex-col pt-[56px]">
      <Header title="" />

      <form onSubmit={submit} className="px-5 space-y-7 pb-5">
        <div>
          <h1 className="text-2xl font-bold leading-snug">
            천밥에 오신 것을<br/>환영합니다!
          </h1>
          <p className="mt-2 text-xs text-gray-500">
            <span className="text-orange-500 font-semibold">1분</span>이면 회원가입 가능해요
          </p>
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-sm text-gray-700">
            비밀번호<span className="text-orange-500">*</span>
          </label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full border-b border-gray-300 outline-none py-2 focus:border-gray-900"
            placeholder="8자~16자의 영문과 숫자를 사용해주세요"
          />
          {pw && !validPwd && (
            <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              8자~16자, 영문+숫자 조합으로 입력해주세요
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-sm text-gray-700">
            비밀번호 확인<span className="text-orange-500">*</span>
          </label>
          <input
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            className="w-full border-b border-gray-300 outline-none py-2 focus:border-gray-900"
            placeholder=""
          />
          {pw2 && !samePwd && (
            <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              비밀번호를 다시 확인해주세요
            </p>
          )}
        </div>

        {/* 이메일(선택) */}
        <div>
          <label className="block text-sm text-gray-700">
            이메일 주소(선택)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-gray-300 outline-none py-2 focus:border-gray-900 placeholder:text-gray-300"
            placeholder="예) cheonbab@cheon.ac.kr"
          />
          {email && !validEmail && (
            <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              이메일 형식을 확인해주세요
            </p>
          )}
        </div>

        {/* 동의 */}
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={agreeAll}
              onChange={(e) => {
                const v = e.target.checked;
                setAgreeAll(v);
                setAgreeTos(v);
                setAgreePrivacy(v);
              }}
              className="w-5 h-5 accent-orange-500"
            />
            <span className="font-medium">모두 동의합니다</span>
          </label>

          <div className="pl-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreeTos}
                  onChange={(e) => setAgreeTos(e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-gray-700">[필수] 이용약관 동의</span>
              </label>
              <button
                type="button"
                onClick={() => router.push('/signup/terms?doc=tos')}
                className="text-xs text-gray-500 inline-flex items-center gap-1 hover:underline"
              >
                내용 보기 <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-gray-700">[필수] 개인 정보 수집 및 이용 동의</span>
              </label>
              <button
                type="button"
                onClick={() => router.push('/signup/terms?doc=privacy')}
                className="text-xs text-gray-500 inline-flex items-center gap-1 hover:underline"
              >
                내용 보기 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-orange-500 text-white font-semibold disabled:opacity-40"
          disabled={!canSubmit}
        >
          본인 인증 후 가입하기
        </button>
      </form>
    </div>
  );
}