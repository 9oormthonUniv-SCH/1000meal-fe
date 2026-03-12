'use client';

import { useStoreFavorites } from "@/lib/hooks/useStoreFavorites";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FavoriteStarButton({
  storeId,
  className,
}: {
  storeId: number;
  className?: string;
}) {
  const router = useRouter();
  const { load, isFavorite, toggle } = useStoreFavorites();

  useEffect(() => {
    // 최초 진입 시 즐겨찾기 목록 로드(로그인 상태일 때만 내부에서 로드됨)
    void load();
  }, [load]);

  const active = isFavorite(storeId);

  const onClick = async () => {
    const res = await toggle(storeId);
    if (!res.ok && res.reason === "LOGIN_REQUIRED") {
      router.push("/login");
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={className ?? "p-2 rounded-md hover:bg-gray-100"}
      aria-label={active ? "즐겨찾기 해제" : "즐겨찾기 추가"}
    >
      <Star
        className={active ? "w-5 h-5 text-orange-500" : "w-5 h-5 text-gray-400"}
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
}

