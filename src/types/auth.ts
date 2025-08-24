export type LoginRole = 'user' | 'admin';

/** 로그인 요청 */
export interface LoginRequest {
  userId: string;
  password: string;
}

/** 로그인 응답 */
export interface LoginResponse {
  accessToken: string;
}

/** 회원가입 요청 */
export interface SignUpRequest {
  userId: string;
  name: string;
  email: string;
  password: string;
}

/** 회원가입 응답 (서버에서 내려주는 스펙이 정해지면 수정) */
export interface SignUpResponse {
  success: boolean;
  message?: string;
}