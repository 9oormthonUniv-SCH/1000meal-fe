'use client';

import {
  getSignupEmailStatus,
  sendSignupEmail,
  verifySignupEmail,
} from '@/lib/api/auth/endpoints';
import { ApiError } from '@/lib/api/errors';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  email: string;
  onChangeEmail: (v: string) => void;
  verified: boolean;
  setVerified: (v: boolean) => void;
  error: string | null;
  setError: (msg: string | null) => void;
}

export default function InputEmail({
  email,
  onChangeEmail,
  verified,
  setVerified,
  error,
  setError,
}: Props) {
  const [emailSent, setEmailSent] = useState(false);
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSendEmail = async () => {
    setSending(true);
    try {
      // ✅ 이메일 가입 여부 확인
      const alreadyRegistered = await getSignupEmailStatus(email);
      if (alreadyRegistered) {
        setError("이미 가입된 이메일입니다.");
        return;
      }
  
      // 🔥 새 요청 시 기존 인증 코드 입력 UI 초기화
      setEmailSent(false);
      setCode('');
      setVerified(false);
  
      await sendSignupEmail(email);
      setEmailSent(true);
      setError(null);
    } catch (e: unknown) {
      const msg = e instanceof ApiError ? e.message : '메일 발송 실패';
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  const handleVerifyEmail = async () => {
    setVerifying(true);
    try {
      await verifySignupEmail(email, code);
      setVerified(true);
      setError(null);
    } catch (e: unknown) {
      const msg = e instanceof ApiError ? e.message : '인증 실패';
      setError(msg);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div>
      <label className="block text-sm text-gray-700">이메일 주소 <span className="text-orange-500">*</span></label>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          className="flex-1 border-b border-gray-300 outline-none py-2 focus:border-gray-900"
          placeholder="예) cheonbab@cheon.ac.kr"
        />
        <button
          type="button"
          onClick={handleSendEmail}
          disabled={!email || sending}
          className="px-3 h-10 flex items-center justify-center rounded-lg bg-orange-500 text-white text-sm disabled:opacity-50"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : '인증 요청'}
        </button>
      </div>

      {emailSent && (
        <div className="mt-3 space-y-2">
          <label className="block text-sm text-gray-700">인증 코드</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 border-b border-gray-300 outline-none py-2 focus:border-gray-900"
            />
            <button
              type="button"
              onClick={handleVerifyEmail}
              disabled={!code || verifying}
              className="px-3 h-10 flex items-center justify-center rounded-lg bg-green-500 text-white text-sm disabled:opacity-50"
            >
              {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : '확인'}
            </button>
          </div>
          {verified && <p className="mt-2 text-xs text-green-600">✅ 인증 완료</p>}

          {/* 📌 메일 사이트 바로가기 버튼 */}
          {email.includes('@') && (
            <a
              href={`https://mail.${email.split('@')[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-blue-600 underline hover:text-blue-800"
            >
              {`메일함 열기 (mail.${email.split('@')[1]})`}
            </a>
          )}
        </div>
      )}

      {/* 필드 에러 메시지 */}
      {error && (
        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      )}
    </div>
  );
}