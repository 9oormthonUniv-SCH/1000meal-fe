import { API_BASE } from "../config";
import { http } from "../http";
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
} from "@/types/auth";

/** 로그인: POST /api/v1/login/user */
export async function loginUser(
  body: LoginRequest,
  signal?: AbortSignal
): Promise<LoginResponse> {
  return http<LoginResponse>(`${API_BASE}/login/user`, {
    method: "POST",
    signal,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

export async function loginAdmin(
  body: LoginRequest,
  signal?: AbortSignal
): Promise<LoginResponse> {
  return http<LoginResponse>(`${API_BASE}/login/admin`, {
    method: "POST",
    signal,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

/** 회원가입: POST /api/v1/signup */
export async function signUp(
  body: SignUpRequest,
  signal?: AbortSignal
): Promise<SignUpResponse> {
  return http<SignUpResponse>(`${API_BASE}/signup/user`, {
    method: "POST",
    signal,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

/** 이메일 인증 코드 전송 */
export async function sendSignupEmail(
  email: string,
  signal?: AbortSignal
): Promise<void> {
  return http<void>(`${API_BASE}/signup/email/send`, {
    method: "POST",
    signal,
    body: JSON.stringify({ email }),
    headers: { "Content-Type": "application/json" },
  });
}

/** 이메일 인증 코드 검증 */
export async function verifySignupEmail(
  email: string,
  code: string,
  signal?: AbortSignal
): Promise<void> {
  return http<void>(`${API_BASE}/signup/email/verify`, {
    method: "POST",
    signal,
    body: JSON.stringify({ email, code }),
    headers: { "Content-Type": "application/json" },
  });
}

export async function getSignupEmailStatus(
  email: string,
  signal?: AbortSignal
): Promise<boolean> {
  return http<boolean>(
    `${API_BASE}/signup/email/status?email=${encodeURIComponent(email)}`,
    { method: "GET", signal }
  );
}