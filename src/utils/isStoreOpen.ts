// utils/isStoreOpen.ts
export function isStoreOpen(hours?: string, remain?: number): boolean {
  if (!hours || typeof hours !== "string") return false;

  const [open, close] = hours.split("~").map((s) => s.trim());
  if (!open || !close) return false;

  const now = new Date();
  const [openH, openM] = open.split(":").map(Number);
  const [closeH, closeM] = close.split(":").map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const timeOk = nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
  const stockOk = remain === undefined || remain > 0;

  return timeOk && stockOk; // ⬅️ 재고도 체크
}