'use client';

import FrequentMenuEditor from "@/components/admin/menu/edit/FrequentMenuEditor";
import { useParams } from "next/navigation";

export default function FrequentMenuEditPage() {
  const params = useParams<{ id: string }>();
  return <FrequentMenuEditor isNew={false} id={params.id} />;
}