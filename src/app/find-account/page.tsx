// app/find-account/page.tsx
'use client';

import { Suspense } from "react";
import FindAccountClient from "./FindAccountClient";

export default function FindAccountPage() {
  return (
    <Suspense fallback={<div>불러오는 중...</div>}>
      <FindAccountClient />
    </Suspense>
  );
}