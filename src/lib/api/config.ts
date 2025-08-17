// src/lib/api/config.ts
export const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
export const DEFAULT_HEADERS = { "Content-Type": "application/json" } as const;
export const DEFAULT_TIMEOUT_MS = 15000;