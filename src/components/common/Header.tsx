'use client';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface Props {
  title: string;
  rightElement?: ReactNode;
  onBack?: () => void;
}

export default function Header({ title, rightElement, onBack }: Props) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div
      id="app-header"
      className="
        fixed top-0 left-1/2 -translate-x-1/2
        w-full max-w-md z-50
        h-[56px] bg-white flex items-center justify-center
        font-pretendard
      "
    >
      {/* 뒤로가기 버튼 */}
      <button
        onClick={handleBack}
        className="absolute left-4 w-7 h-7 flex items-center justify-center"
        aria-label="뒤로가기"
      >
        {/* SVG 아이콘 (피그마와 동일 크기) */}
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          <path
            d="M10.5031 23.0757L11.4345 22.1304L2.98849 13.3068L23.4131 13.3068L23.413 11.7716L2.98489 11.7717L11.3892 2.78796L10.4533 1.85089L0.364595 12.5325L10.5031 23.0757Z"
            fill="black"
          />
        </svg>
      </button>

      {/* 제목 */}
      <span className="text-xl font-semibold text-gray-900">{title}</span>

      {/* 우측 요소 */}
      {rightElement && <div className="absolute right-4">{rightElement}</div>}
    </div>
  );
}