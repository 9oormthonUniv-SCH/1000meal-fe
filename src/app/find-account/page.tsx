'use client';

import FindAccountTabs from "@/components/auth/FindAccountTabs";
import FindIdForm from "@/components/auth/FindIdForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Header from "@/components/common/Header";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FindAccountPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "id" | "pw") || "id";

  const [tab, setTab] = useState<"id" | "pw">(initialTab);
  const router = useRouter();

  return (
    <div className="pt-[56px] px-5">
      <Header title="" onBack={()=>{router.back()}}/>
      <FindAccountTabs tab={tab} setTab={setTab} />
      {tab === "id" ? <FindIdForm /> : <ResetPasswordForm />}
    </div>
  );
}