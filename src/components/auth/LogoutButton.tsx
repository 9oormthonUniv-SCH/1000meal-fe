'use client';

import { meAtom } from '@/atoms/user';
import { deleteCookie } from '@/lib/auth/cookies';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();
  const setMe = useSetAtom(meAtom);

  return () => {
    // ✅ accessToken 쿠키 제거
    deleteCookie("accessToken");

    // ✅ Jotai 상태 초기화
    setMe(null);

    // 로그인 페이지로 이동
    router.replace("/login");
  };
}