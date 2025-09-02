'use client';

import FrequentMenuEditor from "@/components/admin/menu/frequent/FrequentMenuEditor";
import { useParams } from "next/navigation";

export default function FrequentMenuEditPage() {
  const params = useParams<{ id: string }>();
  return <FrequentMenuEditor isNew={false} id={params.id} />;
}