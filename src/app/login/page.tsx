'use client';

import LoginForm, { type LoginRole } from '@/components/auth/LoginForm';
import Header from '@/components/common/Header';
import { loginAdmin, loginUser } from '@/lib/api/auth/endpoints';
import { setSession } from '@/lib/auth/session.client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const handleSubmit = async ({ role, id, pw }: { role: LoginRole; id: string; pw: string }) => {
    if (loading) return;
    setErrMsg(null);
    setLoading(true);
    console.log(role, id, pw);
    try {
      const body = { userId: id.trim(), password: pw };
      const res =
        role === 'admin'
          ? await loginAdmin(body) // { accessToken }
          : await loginUser(body); // { accessToken }
      console.log(res.accessToken, role);
      setSession(res.accessToken, role);

      // 역할별 이동
      if (role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/');
        console.log(res);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '로그인에 실패했습니다.';
      setErrMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col pt-[56px]">
      <Header title="" />
      <LoginForm
        defaultRole="user"
        onSubmit={handleSubmit}
        externalLoading={loading}
        errorMessage={errMsg}
      />
    </div>
  );
}