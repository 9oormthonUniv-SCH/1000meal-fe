// components/common/Header.tsx
'use client';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface Props {
  title: string;
  rightElement?: ReactNode;
  onBack?: () => void; // ✅ 추가
}

export default function Header({ title, rightElement, onBack }: Props) {
  const router = useRouter();

  const handleBack = () => {
    console.log(onBack);
    if (onBack) {
      onBack();       // ✅ 부모에서 제어
    } else {
      router.back();  // ✅ 기본 동작
    }
  };

  return (
    <div
      id="app-header"
      className="
        fixed top-0 left-1/2 -translate-x-1/2
        w-full max-w-md z-50
        h-[56px] bg-white flex items-center justify-center
      "
    >
      <button
        onClick={handleBack}
        className="absolute left-4 text-2xl text-gray-700"
      >
        ←
      </button>
      <span className="text-xl font-semibold text-gray-900">{title}</span>
      {rightElement && <div className="absolute right-4">{rightElement}</div>}
    </div>
  );
}