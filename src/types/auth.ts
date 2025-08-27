export type Role = 'ADMIN' | 'STUDENT';

/** 로그인 요청 */
export interface LoginRequest {
  role: string;
  user_id: string;
  password: string;
}

/** 로그인 응답 */
export interface LoginResponse {
  accountId: string;
  role: Role;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  storeId: number;
  storeName: string;
}

/** 회원가입 요청 */
export interface SignUpRequest {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}

/** 회원가입 응답 */
export interface SignUpResponse {
  accountId: string;
  role: Role;
  username: string;
  email: string;
  status: string;
}

export interface SignupEmailStatus {
  email: string;
  verified: boolean;
}