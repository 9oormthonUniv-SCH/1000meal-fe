'use client';

import { useState } from "react";
//import { findUserId } from "@/lib/api/auth/endpoints";

export default function FindIdForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, ] = useState<string | null>(null);

  // const handleSubmit = async () => {
  //   try {
  //     const res = await findUserId({ name, email });
  //     setResult(res.userId);
  //   } catch {
  //     alert("아이디를 찾을 수 없습니다.");
  //   }
  // }

  return (
    <div>
      <input className="w-full border-b py-2 mb-4" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full border-b py-2 mb-4" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={()=>{}} className="w-full h-12 bg-orange-500 text-white rounded-xl">확인</button>
      {result && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          찾은 아이디: <b>{result}</b>
        </div>
      )}
    </div>
  );
}