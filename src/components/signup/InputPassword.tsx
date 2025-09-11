'use client';

import { AlertCircle } from 'lucide-react';

interface Props {
  pw: string;
  pw2: string;
  onChangePw: (v: string) => void;
  onChangePw2: (v: string) => void;
}

export default function InputPassword({ pw, pw2, onChangePw, onChangePw2 }: Props) {
  // ✅ 영문 + 숫자 + 특수문자 반드시 포함 (8~16자, 공백X)
  const pwdRule =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*().,_-])[A-Za-z\d!@#$%^&*().,_-]{8,16}$/;

  // ✅ 연속 문자/반복 문자 검사 (예: 1234, abcd, aaaa)
  const hasSequential = /(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|defg|efgh|fghi|ghij)/i.test(
    pw
  );
  const hasRepeat = /(.)\1{2,}/.test(pw); // 동일 문자 3번 이상 반복

  const validPwd = pwdRule.test(pw) && !hasSequential && !hasRepeat && !/\s/.test(pw);
  const samePwd = pw.length > 0 && pw === pw2;

  return (
    <>
      <div>
        <label className="block text-sm text-gray-700">
          비밀번호 <span className="text-orange-500">*</span>
        </label>
        <input
          type="password"
          value={pw}
          onChange={(e) => onChangePw(e.target.value)}
          className="w-full border-b border-gray-300 outline-none py-2 focus:border-gray-900"
          placeholder="8~16자 영문·숫자·특수문자 조합"
        />
        {pw && !validPwd && (
          <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> 
            비밀번호는 8~16자의 영문, 숫자, 특수문자를 모두 포함해야 합니다.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-700">
          비밀번호 확인 <span className="text-orange-500">*</span>
        </label>
        <input
          type="password"
          value={pw2}
          onChange={(e) => onChangePw2(e.target.value)}
          className="w-full border-b border-gray-300 outline-none py-2 focus:border-gray-900"
        />
        {pw2 && !samePwd && (
          <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> 비밀번호를 다시 확인해주세요
          </p>
        )}
      </div>
    </>
  );
}