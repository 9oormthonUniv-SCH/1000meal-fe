// app/find-account/FindAccountClient.tsx
'use client';

import FindAccountTabs from "@/components/auth/FindAccountTabs";
import FindIdForm from "@/components/auth/FindIdForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Header from "@/components/common/Header";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FindAccountClient() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "id" | "pw") || "id";

  const [tab, setTab] = useState<"id" | "pw">(initialTab);

  return (
    <div className="pt-[56px] px-5">
      <Header title=""/>
      <FindAccountTabs tab={tab} setTab={setTab} />
      {tab === "id" ? <FindIdForm /> : <ResetPasswordForm />}
    </div>
  );
}