// src/lib/auth/session.server.ts
import { cookies } from "next/headers";

// ✅ 서버에서 세션 확인 (role은 decode해서 써야 함)
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  return { token };
}