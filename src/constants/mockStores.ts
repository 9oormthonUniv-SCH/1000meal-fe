import { FrequentMenuGroup } from "@/types/menu";

export const notices = [
  {
    id: '1',
    title: '오류 수정 안내',
    date: '2025. 08. 01',
    content: '공지사항 상세내용입니다.',
    isNew: true
  },
  {
    id: '2',
    title: '교내 식당 운영시간 업데이트',
    date: '2025. 07. 30',
    content: '운영시간이 변경되었습니다.',
  },
  {
    id: '3',
    title: '천원의 아침밥 서비스 시작',
    date: '2025. 07. 28',
    content: '드디어 시작합니다!',
  }
];

export const mockNotifications = [
  {
    id: 1,
    title: '오픈 알림',
    message: '[베이커리 경]이 영업을 시작했어요',
    time: '30분 전',
    read: false,
  },
  {
    id: 2,
    title: '오픈 알림',
    message: '[향설1관]이 영업을 시작했어요',
    time: '31분 전',
    read: false,
  },
  {
    id: 3,
    title: '품절 임박',
    message: '[향설1관] 수량이 곧 품절돼요!',
    time: '0분 전',
    read: true,
  },
  {
    id: 4,
    title: '품절 예정',
    message: '[향설1관] 수량이 빠르게 줄어들고 있어요!',
    time: '1분 전',
    read: true,
  },
];

export const mockFrequentMenus: FrequentMenuGroup[] = [
  {
    id: "morning-set",
    name: "아침 세트",
    items: ["소보로빵", "아메리카노", "요거트", "과일"],
  },
  {
    id: "lunch-special",
    name: "점심 특선",
    items: ["돈까스", "샐러드"],
  },
  {
    id: "korean-basic",
    name: "한식 기본",
    items: ["김치찌개", "계란말이", "밥"],
  },
];