// src/utils/isStoreOpen.ts
export function isStoreOpen(hours?: string): boolean {
  if (!hours || typeof hours !== "string") {
    return false; // ⬅️ hours 없으면 기본값 false
  }

  const [open, close] = hours.split("~").map((s) => s.trim());
  if (!open || !close) return false;

  const now = new Date();
  const [openH, openM] = open.split(":").map(Number);
  const [closeH, closeM] = close.split(":").map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
}