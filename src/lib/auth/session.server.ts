import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies(); // 비동기
  const token = cookieStore.get("accessToken")?.value;
  const role = cookieStore.get("role")?.value as "admin" | "user" | undefined;
  if (!token || !role) return null;
  return { token, role };
}