import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_FCM_ORIGIN = "https://1000meal.shop";

function getUpstreamOrigin() {
  // 서버 전용 env (선택)
  return process.env.FCM_API_URL || DEFAULT_FCM_ORIGIN;
}

function buildUpstreamUrl(pathParts: string[], search: string) {
  const origin = getUpstreamOrigin().replace(/\/$/, "");
  const path = pathParts.map(encodeURIComponent).join("/");
  return `${origin}/api/v1/fcm/${path}${search || ""}`;
}

async function proxy(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const url = new URL(req.url);
  const upstream = buildUpstreamUrl(path, url.search);

  // ✅ 테스트 서버로는 필요한 헤더만 전달(로컬 쿠키/브라우저 헤더로 인한 5xx 회피)
  const headers = new Headers();
  const auth = req.headers.get("authorization");
  if (auth) headers.set("authorization", auth);
  headers.set("accept", "application/json");
  const ct = req.headers.get("content-type");
  if (ct) headers.set("content-type", ct);

  const init: RequestInit = {
    method: req.method,
    headers,
    // GET/HEAD는 body 불가
    body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.text(),
    redirect: "manual",
  };

  try {
    const res = await fetch(upstream, init);
    const contentType = res.headers.get("content-type") || "application/json";
    const text = await res.text();

    // 실패 응답일 때는 dev에서 원인 파악이 쉽도록 로그 남김
    if (!res.ok) {
      console.error("[FCM Proxy] Upstream error", {
        upstream,
        status: res.status,
        body: text?.slice(0, 2000),
      });
    }

    // ✅ 에러 응답은 항상 JSON으로 래핑해서 프론트에서 원인을 바로 확인할 수 있게 합니다.
    if (!res.ok) {
      const snippet = (text || "").slice(0, 400);
      const wrapped = JSON.stringify({
        message: snippet ? `FCM upstream error: ${snippet}` : "FCM upstream error",
        upstreamStatus: res.status,
        upstreamContentType: contentType,
        upstreamBody: text,
      });
      return new NextResponse(wrapped, {
        status: res.status,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    }

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "content-type": contentType,
        // 캐시 방지(설정 조회 등)
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    console.error("[FCM Proxy] Fetch failed", { upstream, error: e });
    const wrapped = JSON.stringify({
      message: "FCM upstream fetch failed",
    });
    return new NextResponse(wrapped, {
      status: 502,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }
}

export function GET(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx);
}
export function POST(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx);
}
export function PATCH(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx);
}

