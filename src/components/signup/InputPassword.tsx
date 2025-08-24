import { AlertCircle } from 'lucide-react';

interface Props {
  pw: string;
  pw2: string;
  onChangePw: (v: string) => void;
  onChangePw2: (v: string) => void;
}

export default function InputPassword({ pw, pw2, onChangePw, onChangePw2 }: Props) {
  const pwdRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*().,_-]{8,16}$/;
  const validPwd = pwdRule.test(pw);
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
          placeholder="8자~16자의 영문과 숫자를 사용해주세요"
        />
        {pw && !validPwd && (
          <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> 8자~16자, 영문+숫자 조합으로 입력해주세요
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