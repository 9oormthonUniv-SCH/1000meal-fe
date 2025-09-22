// utils/isStoreOpen.ts
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export function isStoreOpen(hours?: string, remain?: number): boolean {
  if (!hours || typeof hours !== "string") return false;

  const [open, close] = hours.split("~").map((s) => s.trim());
  if (!open || !close) return false;

  const now = dayjs().tz("Asia/Seoul");
  const [openH, openM] = open.split(":").map(Number);
  const [closeH, closeM] = close.split(":").map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  const nowMinutes = now.hour() * 60 + now.minute();

  const timeOk = nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
  const stockOk = remain === undefined || remain > 0;

  return timeOk && stockOk;
}