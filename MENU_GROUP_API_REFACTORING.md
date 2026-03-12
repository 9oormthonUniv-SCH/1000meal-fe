# 메뉴 그룹 도메인 리팩토링 가이드

## 📋 개요

한 매장에서 여러 메뉴 그룹을 판매하는 구조로 변경 (예: 향설 2관 = 뼈해장국 매장 + 크앙분식 매장).
기존 단일 메뉴 구조에서 **메뉴 그룹(MenuGroup)** 도메인으로 전환.

---

## 🗂️ 도메인 및 ERD 구조

### 변경 전 (기존)
```
Store (매장)
  └─ DailyMenu (일일 메뉴)
      ├─ menus: string[]
      └─ stock: number
```

### 변경 후 (메뉴 그룹)
```
Store (매장)
  └─ DailyMenu (일일 메뉴)
      ├─ totalStock: number (모든 그룹 재고 합계)
      └─ groups: MenuGroup[]
          ├─ id: number
          ├─ name: string (예: "뼈해장국", "크앙분식")
          ├─ sortOrder: number
          ├─ stock: number (그룹별 재고)
          ├─ capacity: number (최대 재고량)
          └─ menus: string[]
```

### ERD 관계
```
Store (1) ──< (N) DailyMenu
DailyMenu (1) ──< (N) MenuGroup
MenuGroup (1) ──< (N) MenuItem (menus 배열로 표현)
```

---

## 🔄 변경되어야 할 API

### ✅ 이미 구현된 API (Menu Groups)

#### 1. 일일 메뉴 그룹 목록 조회
- **GET** `/api/v1/menus/daily/{storeId}/groups?date={date}`
- **상태**: ✅ 구현됨
- **응답**: `{ data: { id, date, dayOfWeek, totalStock, groups: [...], open, holiday } }`

#### 2. 일일 메뉴 그룹 생성
- **POST** `/api/v1/menus/daily/{storeId}/groups?date={date}`
- **상태**: ✅ 구현됨
- **요청**: `{ name, sortOrder, capacity, menus }`
- **응답**: `{ data: { id, name, sortOrder, stock, capacity, menus } }`

#### 3. 메뉴 그룹 재고 설정
- **PUT** `/api/v1/menus/daily/groups/{groupId}/stock`
- **상태**: ✅ 구현됨
- **요청**: `{ stock: number }`
- **응답**: `{ data: { groupId, stock } }`

#### 4. 메뉴 그룹 재고 차감
- **POST** `/api/v1/menus/daily/groups/{groupId}/deduct?deductionUnit={SINGLE|MULTI_FIVE|MULTI_TEN}`
- **상태**: ✅ 구현됨
- **응답**: `{ data: { groupId, stock } }`

#### 5. 메뉴 그룹 삭제
- **DELETE** `/api/v1/menus/daily/groups/{groupId}`
- **상태**: ✅ 구현됨

#### 6. 주간 메뉴 그룹 조회
- **GET** `/api/v1/menus/weekly/{storeId}/groups?date={date}`
- **상태**: ✅ 구현됨
- **응답**: `{ data: { storeId, startDate, endDate, dailyMenus: [{ id, date, dayOfWeek, holiday, groups: [...], open }] } }`

---

### ⚠️ 추가/수정이 필요한 API

#### 1. 메뉴 그룹 수정 (PUT)
- **엔드포인트**: `PUT /api/v1/menus/daily/groups/{groupId}`
- **목적**: 기존 메뉴 그룹의 이름, 정렬 순서, 최대 재고량, 메뉴 목록 수정
- **요청 본문**:
  ```json
  {
    "name": "string",
    "sortOrder": 0,
    "capacity": 100,
    "menus": ["string"]
  }
  ```
- **응답**: `{ data: { id, name, sortOrder, stock, capacity, menus } }`
- **상태**: ❌ **추가 필요**

#### 2. 특정 메뉴 그룹 상세 조회 (GET)
- **엔드포인트**: `GET /api/v1/menus/daily/groups/{groupId}`
- **목적**: 단일 메뉴 그룹의 상세 정보 조회 (메뉴 관리 페이지에서 사용)
- **응답**: `{ data: { id, name, sortOrder, stock, capacity, menus, date, storeId } }`
- **상태**: ❌ **추가 필요** (선택사항, 일일 목록 조회로 대체 가능)

#### 3. 메뉴 그룹 정렬 순서 변경 (PATCH)
- **엔드포인트**: `PATCH /api/v1/menus/daily/groups/{groupId}/sort`
- **목적**: 메뉴 그룹의 정렬 순서만 변경
- **요청 본문**: `{ sortOrder: number }`
- **응답**: `{ data: { id, sortOrder } }`
- **상태**: ❌ **추가 필요** (선택사항, PUT으로 대체 가능)

---

### 🔧 수정이 필요한 기존 API

#### 1. 일일 메뉴 그룹 생성 API 개선
- **현재**: `POST /api/v1/menus/daily/{storeId}/groups?date={date}`
- **요청 본문에 불필요한 필드 제거**:
  - `sortOrderOrDefault`, `capacityOrDefault`, `nameOrDefault` 제거
  - `sortOrder`, `capacity`, `name`만 필수로 유지
- **상태**: ⚠️ **수정 필요**

---

## 📱 프론트엔드 변경사항

### 1. 관리자 메인 페이지 (`/admin`)

#### 변경 전
```tsx
<button onClick={() => router.push("/admin/menu")}>
  메뉴 관리
</button>
```

#### 변경 후
```tsx
// 메뉴 그룹 목록 조회 후
{menuGroups.map((group) => (
  <button 
    key={group.id}
    onClick={() => router.push(`/admin/menu/${group.id}`)}
  >
    {group.name} 메뉴 관리
  </button>
))}
```

**필요한 API 호출**:
- `GET /api/v1/menus/daily/{storeId}/groups?date={오늘날짜}`

---

### 2. 재고 관리 페이지 (`/admin/inventory`)

#### 변경 전
- 단일 재고 관리 컴포넌트

#### 변경 후
- 메뉴 그룹 개수만큼 재고 관리 컴포넌트 나열
- 각 컴포넌트는 `groupId`를 받아서 독립적으로 재고 관리

**필요한 API 호출**:
- `GET /api/v1/menus/daily/{storeId}/groups?date={오늘날짜}` (메뉴 그룹 목록)
- `PUT /api/v1/menus/daily/groups/{groupId}/stock` (재고 설정)
- `POST /api/v1/menus/daily/groups/{groupId}/deduct?deductionUnit={unit}` (재고 차감)

**컴포넌트 구조**:
```tsx
{groups.map((group) => (
  <StockControlComponent 
    key={group.id}
    groupId={group.id}
    groupName={group.name}
    currentStock={group.stock}
    capacity={group.capacity}
  />
))}
```

---

### 3. 메뉴 관리 페이지 (`/admin/menu`)

#### 변경 전
- 단일 메뉴 관리 페이지 (`/admin/menu`)

#### 변경 후
- 메뉴 그룹별 메뉴 관리 페이지 (`/admin/menu/{groupId}`)
- 각 그룹별로 독립적인 메뉴 관리

**필요한 API 호출**:
- `GET /api/v1/menus/weekly/{storeId}/groups?date={date}` (주간 메뉴 조회)
- `PUT /api/v1/menus/daily/groups/{groupId}` (메뉴 그룹 수정) - **추가 필요**
- `POST /api/v1/menus/daily/{storeId}/groups?date={date}` (새 메뉴 그룹 생성)
- `DELETE /api/v1/menus/daily/groups/{groupId}` (메뉴 그룹 삭제)

---

## 📚 현재 프로젝트 API 구조 (전체)

### Stores API (`/src/lib/api/stores/endpoints.ts`)
- `GET /api/v1/stores` - 매장 목록 조회
- `GET /api/v1/stores/{id}` - 매장 상세 조회
- `POST /api/v1/stores/status/{id}` - 영업 상태 토글
- **변경 필요**: 없음 (매장 단위는 그대로 유지)

### Menus API (`/src/lib/api/menus/endpoints.ts`)
- `GET /api/v1/menus/weekly/{storeId}/groups?date={date}` - 주간 메뉴 그룹 조회 ✅
- `GET /api/v1/menus/daily/{storeId}/groups?date={date}` - 일일 메뉴 그룹 조회 ✅
- `POST /api/v1/menus/daily/{storeId}/groups?date={date}` - 메뉴 그룹 생성 ⚠️ (요청 본문 수정 필요)
- `PUT /api/v1/menus/daily/groups/{groupId}/stock` - 재고 설정 ✅
- `POST /api/v1/menus/daily/groups/{groupId}/deduct` - 재고 차감 ✅
- `DELETE /api/v1/menus/daily/groups/{groupId}` - 메뉴 그룹 삭제 ✅
- **추가 필요**: `PUT /api/v1/menus/daily/groups/{groupId}` - 메뉴 그룹 수정 ❌

### Favorites API (`/src/lib/api/favorites/endpoints.ts`)
- `GET /api/v1/favorites/store/{storeId}` - 매장별 즐겨찾기 그룹 조회
- `GET /api/v1/favorites/group/{groupId}` - 그룹 상세 조회
- `POST /api/v1/favorites/{storeId}` - 즐겨찾기 저장 (메뉴 배열 기준)
- `PUT /api/v1/favorites/{groupId}` - 즐겨찾기 수정
- `DELETE /api/v1/favorites/{storeId}/groups` - 즐겨찾기 삭제
- **검토 필요**: 메뉴 그룹 도메인과의 연관성 (위 "즐겨찾기 도메인과의 연관성" 섹션 참고)

### Store Favorites API (`/src/lib/api/favorites/storeFavorites.ts`)
- `GET /api/v1/favorites/stores` - 즐겨찾기한 매장 목록
- `POST /api/v1/favorites/stores/{storeId}` - 매장 즐겨찾기 추가
- `DELETE /api/v1/favorites/stores/{storeId}` - 매장 즐겨찾기 제거
- **변경 필요**: 없음 (매장 단위는 그대로 유지)

### FCM API (`/src/lib/api/fcm/endpoints.ts`)
- `POST /api/v1/fcm/tokens` - FCM 토큰 등록
- `GET /api/v1/fcm/preferences` - 알림 설정 조회
- `PATCH /api/v1/fcm/preferences` - 알림 설정 변경
- **검토 필요**: 메뉴 그룹별 재고 알림 발송 로직 (백엔드에서 처리)

### Notices API (`/src/lib/api/notices/endpoints.ts`)
- `GET /api/v1/notices` - 공지사항 목록
- `GET /api/v1/notices/{id}` - 공지사항 상세
- `POST /api/v1/notices` - 공지사항 생성
- **변경 필요**: 없음

### Auth API (`/src/lib/api/auth/endpoints.ts`)
- 로그인, 회원가입, 이메일 인증 등
- **변경 필요**: 없음

### Users API (`/src/lib/api/users/endpoints.ts`)
- `GET /api/v1/auth/me` - 내 정보 조회
- **변경 필요**: 없음

---

## 🔍 현재 프론트엔드 API 모듈 분석

### `/src/lib/api/menus/endpoints.ts` (현재)

```typescript
// ✅ 이미 groups API 사용 중
getWeeklyMenu(storeId, date) 
  → GET /menus/weekly/{storeId}/groups?date={date}
  → 상태: 정상

getDailyMenu(storeId, date) 
  → GET /menus/daily/{storeId}/groups?date={date}
  → 상태: 정상

// ⚠️ 수정 필요
saveDailyMenu(storeId, date, menus) 
  → 현재: POST /menus/daily/{storeId}/groups?date={date}
  → 현재 요청 본문: { menus: string[] } (단일 메뉴 배열)
  → 변경 필요: { name, sortOrder, capacity, menus } (메뉴 그룹 생성)
  → 함수명 변경: createMenuGroup()로 변경 권장

// ⚠️ 수정 필요 (경로 오류)
updateDailyStock(menuId, stock)
  → 현재: POST /menus/daily/group/{menuId}/stock
  → 문제: 경로가 잘못됨 (group → groups, POST → PUT)
  → 변경: PUT /menus/daily/groups/{groupId}/stock
  → 함수명 변경: updateMenuGroupStock()로 변경 권장
```

### 필요한 추가/수정 함수

```typescript
// ✅ 메뉴 그룹 생성 (기존 saveDailyMenu 대체)
export async function createMenuGroup(
  storeId: number, 
  date: string, 
  payload: { 
    name: string; 
    sortOrder: number; 
    capacity: number; 
    menus: string[] 
  }
) {
  return http<MenuGroup>(
    `${API_BASE}/menus/daily/${storeId}/groups?date=${date}`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

// ❌ 메뉴 그룹 수정 (추가 필요)
export async function updateMenuGroup(
  groupId: number,
  payload: { 
    name?: string; 
    sortOrder?: number; 
    capacity?: number; 
    menus?: string[] 
  }
) {
  return http<MenuGroup>(
    `${API_BASE}/menus/daily/groups/${groupId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

// ✅ 메뉴 그룹 삭제 (이미 구현 가능)
export async function deleteMenuGroup(groupId: number) {
  return http<void>(
    `${API_BASE}/menus/daily/groups/${groupId}`,
    { method: "DELETE" }
  );
}

// ✅ 메뉴 그룹 재고 설정 (기존 updateDailyStock 수정)
export async function updateMenuGroupStock(
  groupId: number,
  stock: number
) {
  return http<{ groupId: number; stock: number }>(
    `${API_BASE}/menus/daily/groups/${groupId}/stock`,
    {
      method: "PUT",
      body: JSON.stringify({ stock }),
    }
  );
}

// ✅ 메뉴 그룹 재고 차감 (추가 필요)
export async function deductMenuGroupStock(
  groupId: number,
  deductionUnit: 'SINGLE' | 'MULTI_FIVE' | 'MULTI_TEN'
) {
  return http<{ groupId: number; stock: number }>(
    `${API_BASE}/menus/daily/groups/${groupId}/deduct?deductionUnit=${deductionUnit}`,
    { method: "POST" }
  );
}
```

---

## 📝 타입 정의 변경

### `/src/types/menu.ts` (수정 필요)

```typescript
// 기존
export type DailyMenuResponse = {
  id: number;
  date: string;
  stock: number;
  menus: string[];
  open: boolean;
};

// 변경 후
export type MenuGroup = {
  id: number;
  name: string;
  sortOrder: number;
  stock: number;
  capacity: number;
  menus: string[];
};

export type DailyMenuResponse = {
  id: number;
  date: string;
  dayOfWeek: string;
  totalStock: number;
  groups: MenuGroup[];
  open: boolean;
  holiday: boolean;
};

export type WeeklyMenuResponse = {
  storeId: number;
  startDate: string;
  endDate: string;
  dailyMenus: DailyMenuResponse[];
};
```

---

## 🎯 구현 우선순위

### Phase 1: 기본 구조 (필수)
1. ✅ 메뉴 그룹 목록 조회 API (이미 구현)
2. ✅ 메뉴 그룹 생성 API (이미 구현)
3. ✅ 메뉴 그룹 재고 설정/차감 API (이미 구현)
4. ❌ **메뉴 그룹 수정 API 추가** (필수)
5. ✅ 메뉴 그룹 삭제 API (이미 구현)

### Phase 2: 프론트엔드 UI 변경
1. 관리자 메인 페이지: 메뉴 그룹 리스트 버튼
2. 재고 관리 페이지: 그룹별 재고 컴포넌트 분리
3. 메뉴 관리 페이지: 그룹별 라우팅 (`/admin/menu/{groupId}`)

### Phase 3: 선택사항
1. 메뉴 그룹 정렬 순서 변경 API
2. 메뉴 그룹 상세 조회 API

---

## ⚠️ 주의사항

### 1. 기존 API 호환성
- 기존 단일 메뉴 구조를 사용하는 코드가 있다면 점진적 마이그레이션 필요
- 메뉴 그룹이 1개인 경우도 기존처럼 동작하도록 처리

### 2. 즐겨찾기 도메인
- 즐겨찾기는 **메뉴 그룹 단위**로 변경 필요할 수 있음
- 현재 즐겨찾기 API는 메뉴 배열 기준이므로, 메뉴 그룹 ID 기반으로 변경 검토

### 3. FCM 알림
- 즐겨찾기 매장의 **특정 메뉴 그룹** 재고가 10개 이하로 떨어질 때 알림 발송
- 메뉴 그룹별로 독립적인 알림 필요

---

## 🔗 즐겨찾기 도메인과의 연관성

### 현재 즐겨찾기 API 구조
- **즐겨찾기 그룹**: 메뉴 배열(`string[]`) 기준으로 저장
- **엔드포인트**: `/api/v1/favorites/store/{storeId}`, `/api/v1/favorites/{storeId}`

### 메뉴 그룹 도메인 도입 후 영향
- **문제**: 즐겨찾기가 "메뉴 배열" 기준인데, 메뉴 그룹이 여러 개면 어떤 그룹을 즐겨찾기 했는지 불명확
- **해결 방안**:
  1. **옵션 A**: 즐겨찾기를 메뉴 그룹 ID 기반으로 변경
     - `POST /api/v1/favorites/store/{storeId}/groups/{groupId}`
     - 즐겨찾기 = 특정 메뉴 그룹 전체를 즐겨찾기
  2. **옵션 B**: 기존 구조 유지하되, 메뉴 배열이 속한 메뉴 그룹을 자동 매칭
     - 즐겨찾기한 메뉴 배열이 어떤 메뉴 그룹에 속하는지 백엔드에서 판단
  3. **옵션 C**: 즐겨찾기와 메뉴 그룹을 독립적으로 유지
     - 즐겨찾기는 메뉴 배열만 저장, FCM 알림은 메뉴 그룹 재고 기준으로 발송

### 권장사항
- **옵션 A** 권장: 메뉴 그룹 단위로 즐겨찾기하면 UX가 더 명확함
- FCM 알림도 "즐겨찾기한 메뉴 그룹의 재고가 10개 이하"로 명확하게 정의 가능

---

## 📌 요약

### 추가 필요한 API
1. **PUT** `/api/v1/menus/daily/groups/{groupId}` - 메뉴 그룹 수정 (필수)

### 수정 필요한 API
1. **POST** `/api/v1/menus/daily/{storeId}/groups` - 요청 본문에서 불필요한 필드 제거
   - 제거: `sortOrderOrDefault`, `capacityOrDefault`, `nameOrDefault`
   - 유지: `name`, `sortOrder`, `capacity`, `menus`

### 프론트엔드 변경
1. 관리자 메인: 메뉴 그룹 리스트 버튼
2. 재고 관리: 그룹별 컴포넌트 분리
3. 메뉴 관리: 그룹별 라우팅 (`/admin/menu/{groupId}`)

### 타입 정의
- `MenuGroup` 타입 추가
- `DailyMenuResponse`, `WeeklyMenuResponse` 구조 변경

### 즐겨찾기 도메인 검토
- 메뉴 그룹 단위 즐겨찾기로 변경 검토 (옵션 A 권장)
