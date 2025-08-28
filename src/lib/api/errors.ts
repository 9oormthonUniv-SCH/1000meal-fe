/** 서버/네트워크 에러를 정규화한 타입 */
export class ApiError extends Error {
  status?: number; // HTTP status code
  code?: string;   // 서버에서 내려준 에러 코드
  details?: ServerErrorBody;
  isNetwork?: boolean;
  isTimeout?: boolean;
  isAbort?: boolean;

  constructor(message: string, init?: Partial<ApiError>) {
    super(message);
    Object.assign(this, init);
  }
}

/** 서버에서 내려올 수 있는 에러 body 추정 타입 */
export type ServerErrorBody =
  | {
      message?: string;
      code?: string;
      result?: { code?: string; message?: string };
      errors?: { field?: string | null; rejectedValue?: unknown; reason?: string }[];
      statusCode?: number;
      error?: string;
      data?: unknown;
    }
  | Record<string, unknown>;

/** 서버 메시지 추출 결과 타입 */
export interface ExtractedServerMessage {
  message: string;
  code?: string;
  body?: unknown;
}

export async function extractServerMessage(
  res: Response
): Promise<ExtractedServerMessage> {
  const contentType = res.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const body = (await res.json()) as ServerErrorBody;
      const result = body?.result as { code?: string; message?: string } | undefined;

      // ✅ code를 무조건 string | undefined 로 변환
      const code =
        typeof body?.code === "string"
          ? body.code
          : typeof result?.code === "string"
          ? result.code
          : undefined;

      // ✅ message 후보: errors[0].reason → result.message → body.message
      const message =
        (Array.isArray(body?.errors) &&
          typeof body.errors[0]?.reason === "string" &&
          body.errors[0]!.reason) ||
        (typeof result?.message === "string" ? result.message : undefined) ||
        (typeof body?.message === "string" ? body.message : undefined) ||
        "요청 처리 중 오류가 발생했습니다.";

      return { message, code, body };
    } else {
      const text = await res.text();
      return { message: text || "요청 처리 중 오류가 발생했습니다." };
    }
  } catch {
    return { message: "요청 처리 중 오류가 발생했습니다." };
  }
}