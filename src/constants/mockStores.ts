import { Store } from "@/types/store";

export const mockStores: Store[] = [
  {
    id: "1",
    name: "향설 1관",
    menu: ["현미밥", "제육볶음", "미역국", "샐러드"],
    remain: 20,
    address: "충남 아산시 신창면 순천향로 1",
    phone: "041-000-0001",
    hours: "08:00 ~ 소진 시",
    position: { lat: 36.7688, lng: 126.9323 },
  },
  {
    id: "2",
    name: "야외 그라찌에",
    menu: ["소보로빵", "요거트", "우유"],
    remain: 12,
    address: "충남 아산시 신창면 순천향로 22",
    phone: "041-000-0002",
    hours: "08:00 ~ 소진 시",
    position: { lat: 36.7712, lng: 126.9327 },
  },
  {
    id: "3",
    name: "베이커리 경",
    menu: ["인절미", "쿠키", "음료 중 택 1"],
    remain: 0,
    address: "충남 아산시 신창면 순천향로 33",
    phone: "041-000-0003",
    hours: "08:00 ~ 소진 시",
    position: { lat: 36.774667, lng: 126.93362 },
  },
];