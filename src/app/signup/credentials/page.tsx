'use client';

import Header from '@/components/common/Header';
import { signUpUser } from '@/lib/api/auth/endpoints';
import { ApiError } from '@/lib/api/errors';
import { useSignupDraft } from '@/lib/hooks/useSignupDraft';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import ErrorMessage from '@/components/common/ErrorMessage';
import Agreements from '@/components/signup/Agreements';
import InputEmail from '@/components/signup/InputEmail';
import InputName from '@/components/signup/InputName';
import InputPassword from '@/components/signup/InputPassword';
import SignupHeader from '@/components/signup/SignupHeader';

export default function SignupCredentialsPage() {
  const router = useRouter();
  const { get, set, clear } = useSignupDraft();

  // 필수: id 없으면 아이디 페이지로
  useEffect(() => {
    if (!get().id) router.replace('/signup/id');
  }, [get, router]);

  const draft = get();
  const [name, setName] = useState(draft.name ?? '');
  const [pw, setPw] = useState(draft.password ?? '');
  const [pw2, setPw2] = useState(draft.password ?? '');
  const [email, setEmail] = useState(draft.email ?? '');
  const [verified, setVerified] = useState(false);

  const [agreeTos, setAgreeTos] = useState(Boolean(draft.agreeTos));
  const [agreePrivacy, setAgreePrivacy] = useState(Boolean(draft.agreePrivacy));

  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validPwd = useMemo(() => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*().,_-]{8,16}$/.test(pw), [pw]);
  const samePwd  = useMemo(() => pw.length > 0 && pw === pw2, [pw, pw2]);
  const validEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);

  const canSubmit =
    name.trim().length > 0 &&
    validPwd &&
    samePwd &&
    validEmail &&
    verified &&
    agreeTos &&
    agreePrivacy;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setErrMsg(null);
    try {
      const { id } = get();
      if (!id) {
        router.replace('/signup/id');
        return;
      }

      set({ name, email, password: pw, agreeTos, agreePrivacy });
      // Add the new required 'role' field to match SignUpRequest type
      await signUpUser({ role: 'STUDENT', userId: id, name, email, password: pw });

      clear();
      router.replace('/login');
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        // 서버에서 내려준 에러 body 디테일
        const reason =
          Array.isArray((e.details as any)?.errors) &&
          (e.details as any).errors[0]?.reason;
    
        const message =
          reason ||
          (e.details as any)?.result?.message ||
          e.message ||
          "회원가입 실패";
    
        setErrMsg(message);
      } else {
        setErrMsg("회원가입 실패");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col pt-[56px]">
      <Header title="" />

      <form onSubmit={submit} className="px-5 space-y-7 pb-5">
        <SignupHeader />
        <InputName value={name} onChange={setName} />
        <InputPassword pw={pw} pw2={pw2} onChangePw={setPw} onChangePw2={setPw2} />
        <InputEmail email={email} onChangeEmail={setEmail} verified={verified} setVerified={setVerified} error={emailError} setError={setEmailError}/>
        <Agreements agreeTos={agreeTos} setAgreeTos={setAgreeTos} agreePrivacy={agreePrivacy} setAgreePrivacy={setAgreePrivacy} />

        <ErrorMessage msg={errMsg} />

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="w-full h-12 rounded-xl bg-orange-500 text-white font-semibold disabled:opacity-40"
        >
          {submitting ? '가입 중…' : '본인 인증 후 가입하기'}
        </button>
      </form>
    </div>
  );
}