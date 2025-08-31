import { Dayjs } from "dayjs";

/** 기준 날짜의 월요일로 이동 */
export function mondayOf(d: Dayjs) {
  const weekday = d.day(); // 0(일)~6(토)
  const diff = (weekday + 6) % 7;
  return d.subtract(diff, "day").startOf("day");
}