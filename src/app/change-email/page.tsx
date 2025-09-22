'use client';

import Header from '@/components/common/Header';
import { sendEmailChangeCode, startEmailChange, verifyEmailChange } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/errors';
import { getMe } from '@/lib/api/users';
import { getSession } from '@/lib/auth/session.client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChangeEmailPage() {
  const router = useRouter();

  // 단계별 상태
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [password, setPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');

  const [changeId, setChangeId] = useState<string | null>(null);

  // 진행 상태
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [verified, setVerified] = useState(false);

  // 로딩/에러
  const [, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    const { token } = getSession();
    if (!token) return;
    getMe(token)
      .then((me) => setCurrentEmail(me.email))
      .catch(console.error);
  }, []);

  /** 1단계: 현재 이메일 + 비밀번호 확인 */
  const handleVerifyPassword = async () => {
    const { token } = getSession();
    if (!token) return;

    try {
      setLoading(true);
      setErrMsg(null);
      const res = await startEmailChange(token, { currentEmail, password });
      setChangeId(res.changeId);
      setStep1Done(true);
    } catch (err) {
      setErrMsg(err instanceof ApiError ? err.message : '비밀번호 확인 실패');
    } finally {
      setLoading(false);
    }
  };

  /** 2단계: 새 이메일로 인증 코드 발송 */
  const handleSendCode = async () => {
    if (!changeId) return;
    const { token } = getSession();
    if (!token) return;

    if (!newEmail.endsWith('@sch.ac.kr')) {
      setErrMsg('이메일은 반드시 @sch.ac.kr 형식이어야 합니다.');
      return;
    }

    try {
      setLoading(true);
      setErrMsg(null);
      await sendEmailChangeCode(token, { changeId, newEmail });
      setStep2Done(true);
    } catch (err) {
      setErrMsg(err instanceof ApiError ? err.message : '인증 요청 실패');
    } finally {
      setLoading(false);
    }
  };

  /** 3단계: 인증 코드 확인 */
  const handleVerifyCode = async () => {
    if (!changeId) return;
    const { token } = getSession();
    if (!token) return;

    try {
      setLoading(true);
      setErrMsg(null);
      await verifyEmailChange(token, { changeId, code });
      setVerified(true);
    } catch (err) {
      setErrMsg(err instanceof ApiError ? err.message : '코드 검증 실패');
    } finally {
      setLoading(false);
    }
  };

  /** 최종 이메일 변경 */
  const handleChangeEmail = async () => {
    const { token } = getSession();
    if (!token) return;

    try {
      await getMe(token); // 갱신
      router.replace('/mypage');
    } catch {
      alert('이메일 변경은 성공했지만 정보 갱신에 실패했습니다. 다시 로그인해주세요.');
      router.replace('/login');
    }
  };

  return (
    <div className="flex flex-col pt-[56px] px-6 bg-white min-h-dvh">
      <Header title="회원정보 변경" />

      <p className="text-center text-sm text-gray-500 mt-4">
        안전하게 이메일을 변경하기 위해서 <br />
        <span className="text-red-500 font-semibold">비밀번호를 한 번 더 입력</span>해주세요
      </p>

      {/* 현재 이메일 */}
      <div className="mt-6">
        <label className="block text-sm text-gray-400">현재 이메일</label>
        <input
          disabled
          value={currentEmail}
          className="w-full border-b py-2 text-gray-400 bg-gray-50"
        />
      </div>

      {/* 비밀번호 */}
      <div className="mt-6 flex gap-2 items-center">
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={step1Done}
          className="flex-1 border-b py-2"
        />
        <button
          onClick={handleVerifyPassword}
          disabled={!password || step1Done}
          className={`px-4 py-2 rounded-lg text-white ${password && !step1Done ? 'bg-orange-500' : 'bg-gray-300'}`}
        >
          {step1Done ? '완료' : '확인'}
        </button>
      </div>

      {/* 새 이메일 */}
      {step1Done && (
        <div className="mt-6 flex gap-2 items-center">
          <input
            type="email"
            placeholder="새 이메일 (@sch.ac.kr)"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={step2Done}
            className="flex-1 border-b py-2"
          />
          <button
            onClick={handleSendCode}
            disabled={
              !newEmail.endsWith('@sch.ac.kr') || step2Done
            }
            className={`px-4 py-2 rounded-lg text-white ${
              newEmail.endsWith('@sch.ac.kr') && !step2Done
                ? 'bg-orange-500'
                : 'bg-gray-300'
            }`}
          >
            {step2Done ? '완료' : '인증 요청'}
          </button>
        </div>
      )}

      {/* 인증 코드 */}
      {step2Done && (
        <div className="mt-2">
          <a
            href="https://mail.sch.ac.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-blue-600 underline hover:text-blue-800"
          >
            메일함 열기 (mail.sch.ac.kr)
          </a>
        </div>
      )}
      {step2Done && (
        <div className="mt-6 flex gap-2 items-center">
          <input
            type="text"
            placeholder="인증 코드"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={verified}
            className="flex-1 border-b py-2"
          />
          <button
            onClick={handleVerifyCode}
            disabled={!code || verified}
            className={`px-4 py-2 rounded-lg text-white ${code && !verified ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            {verified ? '완료' : '확인'}
          </button>
        </div>
      )}

      {/* 최종 변경 */}
      {verified && (
        <button
          onClick={handleChangeEmail}
          className="mt-10 w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-lg"
        >
          이메일 변경하기
        </button>
      )}

      {errMsg && <p className="mt-4 text-center text-red-500 text-sm">{errMsg}</p>}
    </div>
  );
}
