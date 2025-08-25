'use client';

import LoginForm, { type LoginRole } from '@/components/auth/LoginForm';
import Header from '@/components/common/Header';
import { loginUser } from '@/lib/api/auth/endpoints';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const handleSubmit = async ({ role, id, pw }: { role: LoginRole; id: string; pw: string }) => {
    if (loading) return;
    setErrMsg(null);
    setLoading(true);
    try {
      const body = { usernameOrEmail: id.trim(), password: pw, role };
      const res = await loginUser(body); // { accessToken, role }
      setCookie('accessToken', res.accessToken);
      setCookie('role', res.role.toUpperCase());

      // 역할별 이동
      const normalizedRole = res.role.toUpperCase();
      if (normalizedRole === 'ADMIN') {
        router.replace('/admin');
      } else {
        router.replace('/');
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