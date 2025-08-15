// components/common/Header.tsx
'use client';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface Props { title: string; rightElement?: ReactNode; }

export default function Header({ title, rightElement }: Props) {
  const router = useRouter();
  return (
    <div
      id="app-header"
      className="sticky top-0 left-0 w-full z-40 h-[56px] bg-white flex items-center justify-center relative border-b"
    >
      <button onClick={() => router.back()} className="absolute left-4 text-2xl text-gray-700">←</button>
      <span className="text-xl font-semibold text-gray-900">{title}</span>
      {rightElement && <div className="absolute right-4">{rightElement}</div>}
    </div>
  );
}