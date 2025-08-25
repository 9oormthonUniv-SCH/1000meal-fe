import type { LoginRequest, LoginResponse, SignupEmailStatus, SignUpRequest, SignUpResponse } from "@/types/auth";
import { ApiResponse } from "@/types/user";
import { API_BASE } from "../config";
import { http } from "../http";

/** 로그인 */
export async function loginUser(payload: LoginRequest) {
  return http<LoginResponse>(`${API_BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** 회원가입 */
export async function signUpUser(payload: SignUpRequest) {
  return http<SignUpResponse>(`${API_BASE}/auth/signup`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** 이메일 인증 코드 전송 */
export async function sendEmailVerification(email: string) {
  return http(`${API_BASE}/auth/email/send`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/** 이메일 인증 코드 검증 */
export async function verifyEmail(email: string, code: string) {
  return http(`${API_BASE}/auth/email/verify`, {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function getSignupEmailStatus(email: string) {
  const res = await http<ApiResponse<SignupEmailStatus>>(
    `${API_BASE}/auth/email/status?email=${encodeURIComponent(email)}`,
    { method: "GET" }
  );
  return res.data; // { email, verified }
}