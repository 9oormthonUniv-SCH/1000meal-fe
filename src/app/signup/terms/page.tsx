import TermsContent from "@/components/signup/TermsContent";
import { Suspense } from "react";

export default function TermsPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <TermsContent />
    </Suspense>
  );
}