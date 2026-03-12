import type { StoreListItem } from "@/types/store";

/** 매장 당일 메뉴 그룹별 재고 합계 (지도 마커 등 단일 재고 표시용) */
export function getStoreDisplayStock(store: StoreListItem | null | undefined): number {
  const groups = store?.todayMenu?.menuGroups;
  if (!groups?.length) return 0;
  return groups.reduce((sum, g) => sum + (g.stock ?? 0), 0);
}

/** 첫 번째 메뉴 그룹 재고 (단일 그룹 카드 표시용) */
export function getFirstGroupStock(store: StoreListItem | null | undefined): number {
  return store?.todayMenu?.menuGroups?.[0]?.stock ?? 0;
}

/** 단일 그룹일 때 메뉴 텍스트 (menuGroups 기준) */
export function getSingleGroupMenusText(store: StoreListItem | null | undefined): string {
  const groups = store?.todayMenu?.menuGroups;
  if (!groups?.length) return "메뉴 정보 없음";
  const names = groups.flatMap((g) => g.menus.map((m) => m.name));
  return names.length > 0 ? names.join(", ") : "메뉴 정보 없음";
}
