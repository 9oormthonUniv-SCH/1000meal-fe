# 오늘 순밥 (1000meal)

순천향대학생을 위한 아침 식사 정보 서비스

## 📋 프로젝트 소개

**오늘 순밥**은 순천향대학교 학생들이 학교 주변 식당의 아침 메뉴 정보를 쉽게 확인할 수 있도록 도와주는 웹 애플리케이션입니다. 카카오맵을 활용한 지도 기반 매장 탐색, 실시간 메뉴 정보, 공지사항 등 다양한 기능을 제공합니다.

### 주요 기능

- 🗺️ **지도 기반 매장 탐색**: 카카오맵을 활용한 매장 위치 확인
- 🍽️ **실시간 메뉴 정보**: 오늘의 메뉴 및 가격 정보 조회
- 📢 **공지사항**: 중요한 공지사항 확인
- ⭐ **즐겨찾기**: 자주 가는 매장 즐겨찾기 기능
- 👤 **사용자 인증**: 학생/관리자 역할 기반 인증 시스템
- 🛠️ **관리자 페이지**: 메뉴 관리, 재고 관리 등 관리자 기능
- 📦 **재고 관리**: 관리자 실시간 재고 업데이트 시스템
- 📱 **PWA 지원**: 모바일 앱처럼 사용 가능한 PWA 기능

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15.3.5 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4
- **State Management**: Jotai 2.13
- **Animation**: Framer Motion 12.23
- **Icons**: Lucide React, React Icons

### 주요 라이브러리
- **HTTP Client**: Axios 1.11
- **Authentication**: JWT (jsonwebtoken, jwt-decode)
- **Maps**: React Kakao Maps SDK 1.2
- **Date**: Day.js 1.11
- **PWA**: next-pwa 5.6
- **Utilities**: clsx, js-cookie

### 개발 도구
- **Linting**: ESLint 9
- **Build Tool**: Next.js (Turbopack)
- **Package Manager**: npm

## 📁 프로젝트 구조

```
1000meal-fe/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── admin/             # 관리자 페이지
│   │   │   ├── inventory/     # 재고 관리
│   │   │   └── menu/          # 메뉴 관리
│   │   ├── login/             # 로그인 페이지
│   │   ├── signup/            # 회원가입 페이지
│   │   ├── map/               # 지도 페이지
│   │   ├── store/             # 매장 상세 페이지
│   │   ├── mypage/            # 마이페이지
│   │   ├── notice/            # 공지사항
│   │   └── layout.tsx         # 루트 레이아웃
│   │
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── admin/            # 관리자 전용 컴포넌트
│   │   ├── auth/             # 인증 관련 컴포넌트
│   │   ├── common/           # 공통 컴포넌트
│   │   ├── main/             # 메인 페이지 컴포넌트
│   │   ├── map/              # 지도 관련 컴포넌트
│   │   ├── notice/           # 공지사항 컴포넌트
│   │   ├── signup/           # 회원가입 컴포넌트
│   │   └── store/            # 매장 관련 컴포넌트
│   │
│   ├── lib/                   # 유틸리티 및 라이브러리
│   │   ├── api/              # API 클라이언트
│   │   │   ├── auth/         # 인증 API
│   │   │   ├── stores/       # 매장 API
│   │   │   ├── menus/        # 메뉴 API
│   │   │   ├── notices/      # 공지사항 API
│   │   │   ├── users/        # 사용자 API
│   │   │   ├── favorites/    # 즐겨찾기 API
│   │   │   ├── config.ts     # API 설정
│   │   │   ├── http.ts       # HTTP 클라이언트
│   │   │   └── errors.ts     # 에러 처리
│   │   ├── auth/             # 인증 유틸리티
│   │   └── hooks/            # 커스텀 훅
│   │
│   ├── atoms/                 # Jotai 상태 관리
│   │   └── user.ts           # 사용자 상태
│   │
│   ├── types/                 # TypeScript 타입 정의
│   │   ├── auth.ts
│   │   ├── store.ts
│   │   ├── menu.ts
│   │   ├── notice.ts
│   │   └── user.ts
│   │
│   ├── utils/                 # 유틸리티 함수
│   │   ├── isStoreOpen.ts    # 매장 영업 시간 체크
│   │   └── week.ts           # 요일 관련 유틸리티
│   │
│   └── middleware.ts          # Next.js 미들웨어 (인증/인가)
│
├── public/                    # 정적 파일
│   ├── icons/                # 아이콘 이미지
│   ├── splash_screens/       # PWA 스플래시 스크린
│   └── manifest.json         # PWA 매니페스트
│
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions 배포 워크플로우
│
├── next.config.ts            # Next.js 설정
├── tailwind.config.ts        # Tailwind CSS 설정
├── tsconfig.json             # TypeScript 설정
└── package.json              # 프로젝트 의존성
```

## 🏗️ 아키텍처

### 인증/인가 구조

- **JWT 기반 인증**: Access Token을 쿠키에 저장하여 인증 상태 관리
- **미들웨어 기반 라우트 보호**: Next.js Middleware를 통한 자동 인증/인가 처리
  - 보호된 경로: `/mypage/*`, `/admin/*`
  - 관리자 권한 검증: JWT 토큰의 `role` 필드로 관리자 권한 확인
- **상태 관리**: Jotai를 활용한 전역 사용자 상태 관리

### API 구조

- **계층화된 API 클라이언트**: 도메인별로 분리된 API 엔드포인트
- **중앙화된 HTTP 클라이언트**: Axios 기반 통합 HTTP 클라이언트
- **에러 처리**: 통합 에러 핸들링 및 사용자 친화적 에러 메시지
- **API 프록시**: Next.js Rewrites를 통한 API 프록시 설정

### 컴포넌트 구조

- **도메인 기반 컴포넌트 분리**: 기능별로 컴포넌트 디렉토리 구성
- **재사용 가능한 공통 컴포넌트**: `common` 디렉토리에 공통 UI 컴포넌트
- **커스텀 훅**: API 호출 및 상태 관리를 위한 커스텀 훅 제공

### 재고 관리 시스템

- **현재 구현 (v0.1)**: 
  - 관리자 수동 재고 업데이트
  - 단발성 fetch 요청 방식
  - 클라이언트 상태 저장 없음 (no store)
  - 실시간 재고 데이터 전송

- **향후 계획 (다음 학기)**:
  - 플랫폼 내 결제 시스템 통합
  - 결제 완료 시 재고 자동 차감
  - 실시간 재고 동기화 개선

### 배포 구조

- **CI/CD**: GitHub Actions를 통한 자동 배포
- **배포 환경**: AWS EC2 서버에 PM2로 프로세스 관리
- **빌드 최적화**: 프로덕션 빌드 최적화 및 아티팩트 관리


## 📝 주요 업데이트 내역

### 최근 업데이트 (2024)

- **세션 기반 유저정보 저장 로직 수정**: 사용자 정보 관리 개선
- **타임존 오차 수정**: 시간 관련 버그 수정
- **휴무 제거 기능**: 매장 휴무일 관리 기능 개선
- **마이페이지 리다이렉트 URL 수정**: 사용자 경험 개선
- **전화번호 미등록 처리**: 매장 정보 표시 개선
- **지도 바텀카드 padding 추가**: UI 개선
- **자주 쓰는 메뉴 API 수정**: 자주 사용하는 메뉴 기능 개선
- **이메일 변경 페이지 추가**: 사용자 정보 관리 기능 추가
- **하단 Footer 정보 변경**: 연락처 정보 업데이트
- **인스타그램 URL 수정**: 소셜 미디어 링크 업데이트
- **API 토큰 추가**: 보안 강화
- **API 명 변경**: RESTful API 네이밍 개선
- **자주 쓰는 메뉴 삭제 API 추가**: 기능 확장
- **에러 메시지 업데이트**: 사용자 친화적 에러 메시지 개선
- **비밀번호 형식 변경**: 보안 정책 업데이트
- **매장 상세페이지 진입시 금일 메뉴로 스크롤**: UX 개선

## 🤝 기여하기

이 프로젝트는 순천향대학교 학생들을 위한 서비스입니다. 버그 리포트나 기능 제안은 이슈로 등록해주세요.

## 📄 라이선스

이 프로젝트는 private 프로젝트입니다.

## 문의 📧 jeong01101095@gmail.com

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**오늘 순밥** - 당신의 걸음이 헛되지 않도록
