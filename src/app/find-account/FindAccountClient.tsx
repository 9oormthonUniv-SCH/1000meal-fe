// app/find-account/FindAccountClient.tsx
'use client';

import { useSearchParams } from "next/navigation";

export default function FindAccountClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div>
      <h1>계정 찾기</h1>
      {token ? <p>토큰: {token}</p> : <p>토큰이 없습니다.</p>}
    </div>
  );
}