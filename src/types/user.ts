export interface User {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "STUDENT" | "ADMIN" | "USER"; // 서버에서 어떤 값 내려주는지에 맞게 확장 가능
}

export interface ApiResponse<T> {
  data: T;
  result: {
    code: string;
    message: string;
    timestamp: string;
  };
}