'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type LoginRole = 'STUDENT' | 'ADMIN';

type Props = {
  defaultRole?: LoginRole;
  onSubmit?: (payload: { role: LoginRole; id: string; pw: string }) => Promise<void> | void;
  externalLoading?: boolean;
  errorMessage?: string | null;
};

export default function LoginForm({
  defaultRole = 'STUDENT',
  onSubmit,
  externalLoading,
  errorMessage = null,
}: Props) {
  const [role, setRole] = useState<LoginRole>(defaultRole);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const isLoading = externalLoading ?? loading;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFailed(false);
    try {
      if (onSubmit) {
        await onSubmit({ role, id, pw });
      } else {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        setLoading(false);
        setFailed(true);
      }
    } catch {
      setFailed(true);
    }
  };

  return (
    <div className="px-5 py-4 flex-1">
      {/* 탭 메뉴 */}
      <div className="relative flex justify-center border-b border-gray-200 mb-6">
        {(['STUDENT', 'ADMIN'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={clsx(
              'relative flex-1 py-2 text-sm font-medium text-center transition-colors',
              role === r ? 'text-gray-900' : 'text-gray-400'
            )}
          >
            {r === 'STUDENT' ? '일반' : '관리자'}
            {role === r && (
              <motion.div
                layoutId="underline"
                className={clsx(
                  "absolute bottom-0 left-0 right-0 h-[2px]",
                  r === "STUDENT" ? "bg-orange-500" : "bg-blue-400"
                )}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* 텍스트 + 로고 */}
      <div className="relative h-28 mb-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={clsx(
              "absolute top-0 w-full",
              role === "ADMIN" ? "text-right" : "text-left"
            )}
          >
            <h1 className="text-2xl font-bold leading-snug whitespace-pre-line mb-3">
              {role === "STUDENT"
                ? "당신의 걸음이\n헛되지 않도록,"
                : "당신의 준비가\n늘 편리하도록,"}
            </h1>
            <div
              className={clsx(
                "w-28 h-8 flex items-center",
                role === "ADMIN" ? "ml-auto justify-end" : "justify-start"
              )}
            >
              <Image
                src="/logo.png"
                alt="오늘 순밥"
                width={112}
                height={32}
                className="h-8 object-contain"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-gray-600 mb-2">아이디</label>
          <input
            className="w-full border-b border-gray-300 outline-none py-2 focus:border-gray-800"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">비밀번호</label>
          <input
            type="password"
            className="w-full border-b border-gray-300 outline-none py-2 focus:border-gray-800"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="current-password"
            required
          />
          {(failed || errorMessage) && (
            <p className="mt-2 text-xs text-red-500">
              {errorMessage ?? '아이디 또는 비밀번호를 확인해주세요.'}
            </p>
          )}
        </div>
        <motion.button
          type="submit"
          disabled={isLoading}
          animate={{
            backgroundColor: role === "STUDENT" ? "#F97316" : "#60A5FA",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full h-12 rounded-xl text-white font-semibold flex items-center justify-center disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "로그인"}
        </motion.button>
        <div className="flex items-center justify-around text-xs text-gray-500 mx-5">
          <button
            type="button"
            onClick={() => router.push('/find-account?tab=id')}
            className="hover:underline"
          >
            아이디 찾기
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={() => router.push('/find-account?tab=pw')}
            className="hover:underline"
          >
            비밀번호 찾기
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={() => router.push('/signup/id')}
            className="hover:underline"
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}