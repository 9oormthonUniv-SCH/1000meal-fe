/** 서버/네트워크 에러를 정규화한 타입 */
export class ApiError extends Error {
  /** HTTP status code (ex. 400, 401, 500 ...) */
  status?: number;

  /** 서버에서 내려준 에러 코드 */
  code?: string;

  /** 서버에서 내려준 원본 응답 body */
  details?: unknown;

  /** 네트워크/브라우저 단 절 (CORS, DNS 오류 등) */
  isNetwork?: boolean;

  /** 타임아웃 여부 */
  isTimeout?: boolean;

  /** AbortController 에 의한 취소 여부 */
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
      statusCode?: number;
      error?: string;
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
      const code =
        body?.code ??
        (typeof body?.result === "object"
          ? (body.result as any)?.code
          : undefined);

      const message =
        (typeof body?.result === "object" && (body.result as any)?.message) ||
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