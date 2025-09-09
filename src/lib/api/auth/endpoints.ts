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

export async function verifyId(userId: string) {
  return http<{ valid: boolean; status: string; message: string }>(
    `${API_BASE}/signup/user/validate-id`,{
      method: "POST",
      body: JSON.stringify({ userId }), // ✅ 키 이름 userId로 맞춤
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

/** 비밀번호 재설정 요청 (인증 코드 발송) */
export async function resetPasswordRequest(email: string) {
  return http<{ message: string }>(`${API_BASE}/auth/password/reset/request`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/** 비밀번호 재설정 완료 (코드 + 새 비밀번호) */
export async function resetPasswordConfirm(payload: {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return http<{ message: string }>(`${API_BASE}/auth/password/reset/confirm`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** 아이디 찾기 */
export async function findUserId(payload: { email: string }) {
  return http<{ message: string; userId: string }>(
    `${API_BASE}/auth/find-id`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}