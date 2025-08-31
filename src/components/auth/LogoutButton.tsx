'use client';

import { meAtom, storeIdAtom } from '@/atoms/user';
import { deleteCookie } from '@/lib/auth/cookies';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();
  const setMe = useSetAtom(meAtom);
  const setStoreId = useSetAtom(storeIdAtom);

  return () => {
    // 쿠키 제거
    deleteCookie("accessToken");
    deleteCookie("role");

    // ✅ Jotai 상태 초기화
    setMe(null);
    setStoreId(null);

    // 로그인 페이지로 이동
    router.replace("/login");
  };
}