'use client';

import { tokenAtom } from '@/atoms/user';
import { clearSession } from '@/lib/auth/session.client';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();
  const setToken = useSetAtom(tokenAtom);

  return () => {
    clearSession();
    setToken(null);
    router.replace("/login");
  };
}