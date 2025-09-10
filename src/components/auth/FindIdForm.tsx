'use client';

import { findUserId } from "@/lib/api/auth/endpoints"; // 새 함수 만들어줄 것
import { useState } from "react";

export default function FindIdForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const res = await findUserId({ name, email });
      setResult(res.userId); // 응답에서 userId 꺼내기
    } catch (err) {
      console.log(err);
      alert("아이디를 찾을 수 없습니다.");
    }
  };

  return (
    <div>
      <input
        className="w-full border-b py-2 mb-4"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full border-b py-2 mb-4"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="w-full h-12 bg-orange-500 text-white rounded-xl"
      >
        확인
      </button>

      {result && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          입력하신 회원정보와 일치하는 아이디는 <b>{result}</b> 입니다.
        </div>
      )}
    </div>
  );
}