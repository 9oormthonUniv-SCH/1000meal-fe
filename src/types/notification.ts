export type NotificationItem = {
  id: number | string;
  title: string;
  body: string;
  /** 읽음 여부(없을 수도 있음) */
  isRead?: boolean;
  createdAt: string;
  /** 백엔드에서 임의 데이터 내려주면 보관 */
  data?: Record<string, unknown>;
};

