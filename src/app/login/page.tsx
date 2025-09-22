'use client';

import { tokenAtom } from '@/atoms/user';
import LoginForm, { type LoginRole } from '@/components/auth/LoginForm';
import Header from '@/components/common/Header';
import { loginUser } from '@/lib/api/auth/endpoints';
import { ApiError, ServerErrorBody } from '@/lib/api/errors';
import { getMe } from '@/lib/api/users';
import { setSession } from '@/lib/auth/session.client';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const setToken = useSetAtom(tokenAtom);

  const handleSubmit = async ({ role, id, pw }: { role: LoginRole; id: string; pw: string }) => {
    if (loading) return;
    setErrMsg(null);
    setLoading(true);

    try {
      const body = { user_id: id.trim(), password: pw, role };
      const res = await loginUser(body); // { accessToken }

      // ✅ 세션에 저장
      setSession(res.accessToken);
      setToken(res.accessToken);

      // ✅ 서버에서 유저 정보 가져오기 → 단순 redirect 용도
      const me = await getMe(res.accessToken);

      router.replace(me.role === 'ADMIN' ? '/admin' : '/');
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        const details: ServerErrorBody | undefined = e.details;
        const reason = Array.isArray(details?.errors) && details.errors[0]?.reason;
        setErrMsg(reason || details?.result || e.message || '로그인에 실패했습니다.');
      } else {
        setErrMsg('로그인에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col pt-[56px]">
      <Header title="" onBack={() => router.push('/')} />
      <LoginForm
        onSubmit={handleSubmit}
        externalLoading={loading}
        errorMessage={errMsg}
      />
    </div>
  );
}