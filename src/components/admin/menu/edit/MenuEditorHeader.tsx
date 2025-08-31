'use client';

import Header from "@/components/common/Header";
import { useRouter } from "next/navigation";

export default function MenuEditorHeader({ onSave, onBack }: { onSave: () => void; onBack: () => void }) {
  const router = useRouter();
  return (
    <Header
      title="메뉴 수정"
      rightElement={
        <button
          onClick={onSave}
          className="px-3 py-1.5 rounded-xl bg-orange-500 text-white text-sm font-semibold"
        >
          저장
        </button>
      }
      onBack={() => router.push("/admin/menu")}
    />
  );
}