import { deleteCookie } from "@/lib/auth/cookies";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  return () => {
    deleteCookie("accessToken");
    deleteCookie("role");
    router.replace("/login"); // 로그인 페이지로 이동
  };
}