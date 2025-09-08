'use client';

import { resetPasswordConfirm, resetPasswordRequest } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const [emailSent, setEmailSent] = useState(false); // ✅ 메일 발송 여부
  const [, setVerified] = useState(false); // ✅ 코드 검증 성공 여부

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  // ✅ 메일 발송 요청
  const handleRequest = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await resetPasswordRequest(email);
      setEmailSent(true);
      setError(null);
      setSuccess("인증 메일이 발송되었습니다.");
    } catch (e: unknown) {
      const msg = e instanceof ApiError ? e.message : "메일 발송 실패";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 비밀번호 변경
  const handleConfirm = async () => {
    if (pw !== pw2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setVerifying(true);
    setError(null);
    setSuccess(null);
    try {
      await resetPasswordConfirm({
        email,
        token,
        newPassword: pw,
        confirmPassword: pw2,
      });
      setVerified(true);
      router.push('/');
    } catch (e: unknown) {
      const msg = e instanceof ApiError ? e.message : "재설정 실패";
      setError(msg);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 이메일 입력 */}
      <label className="block text-sm text-gray-700">이메일</label>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border-b border-gray-300 outline-none py-2 focus:border-gray-900"
          placeholder="예) cheonbab@cheon.ac.kr"
        />
        <button
          type="button"
          onClick={handleRequest}
          disabled={!email || loading}
          className="px-3 h-10 flex items-center justify-center rounded-lg bg-orange-500 text-white text-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "인증 요청"}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      )}
      {success && (
        <p className="text-xs text-green-600">✅ {success}</p>
      )}

      {/* 인증 코드 입력 */}
      {emailSent && (
        <>
          <label className="block text-sm text-gray-700">인증 코드</label>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full border-b py-2 mb-3 outline-none focus:border-gray-900"
            placeholder="메일로 받은 인증 코드 입력"
          />
          <a
            href={`https://mail.${email.split("@")[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-blue-600 underline hover:text-blue-800"
          >
            {`메일함 열기 (mail.${email.split("@")[1]})`}
          </a>
        </>
      )}
      

      {/* 비밀번호 입력 */}
      <label className="block text-sm text-gray-700">새 비밀번호</label>
      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        className="w-full border-b py-2 mb-3 outline-none focus:border-gray-900"
        placeholder="새 비밀번호"
      />

      <label className="block text-sm text-gray-700">비밀번호 확인</label>
      <input
        type="password"
        value={pw2}
        onChange={(e) => setPw2(e.target.value)}
        className="w-full border-b py-2 mb-3 outline-none focus:border-gray-900"
        placeholder="새 비밀번호 확인"
      />

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!token || !pw || !pw2 || verifying}
        className="w-full h-12 bg-orange-500 text-white rounded-xl disabled:opacity-50 flex items-center justify-center"
      >
        {verifying ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "비밀번호 변경"
        )}
      </button>

    </div>
  );
}