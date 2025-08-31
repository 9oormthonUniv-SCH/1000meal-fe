// utils/isStoreOpen.ts
export function isStoreOpen(hours: string, remain: number): boolean {
  if (remain <= 0) return false;

  const now = new Date();
  const [startTimeStr] = hours.split('~').map((s) => s.trim()); // "08:00"

  const [startHour, startMinute] = startTimeStr.split(':').map(Number);
  const startTime = new Date();
  startTime.setHours(startHour, startMinute, 0, 0);

  return now >= startTime;
}