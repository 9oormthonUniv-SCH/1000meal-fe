# 이미지 오류 해결 가이드

## 현재 상황
- `next.config.ts`에 `unoptimized: true` 설정 완료 ✅
- 여전히 `INVALID_IMAGE_OPTIMIZE_REQUEST` 오류 발생 ❌

## 해결 방법

### 1. Vercel 배포 확인 (가장 중요!)

**확인 사항:**
- [ ] 변경사항이 커밋되고 푸시되었는가?
- [ ] Vercel에서 최신 배포가 완료되었는가?
- [ ] 배포 로그에서 `unoptimized: true` 설정이 적용되었는가?

**확인 방법:**
1. Vercel 대시보드 접속
2. 최신 배포 확인
3. 배포 로그에서 `next.config.ts`가 포함되어 있는지 확인

### 2. 브라우저 캐시 클리어

**방법 1: 하드 리프레시**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**방법 2: 개발자 도구에서 캐시 비활성화**
1. F12 (개발자 도구 열기)
2. Network 탭
3. "Disable cache" 체크박스 활성화
4. 페이지 새로고침

**방법 3: 시크릿 모드에서 테스트**
- 시크릿/프라이빗 브라우징 모드에서 사이트 접속

### 3. Vercel 빌드 캐시 클리어

Vercel 대시보드에서:
1. 프로젝트 설정 → General
2. "Clear Build Cache" 클릭
3. 재배포

### 4. 로컬에서 테스트

로컬에서 빌드하여 확인:

```bash
npm run build
npm start
```

로컬에서도 같은 오류가 발생하는지 확인합니다.

### 5. Network 탭에서 확인

브라우저 개발자 도구 → Network 탭:
- `/_next/image?url=...` 요청이 여전히 발생하는가?
- 아니면 S3 URL로 직접 요청하는가?

**예상되는 동작 (`unoptimized: true` 적용 시):**
- ❌ `/_next/image?url=...` 요청 없음
- ✅ `https://1000mealsql.s3.ap-northeast-2.amazonaws.com/...` 직접 요청

## 중요: 각 Image 컴포넌트에 unoptimized 추가 불필요

**❌ 잘못된 방법:**
```tsx
<Image 
  src={imageUrl} 
  unoptimized={true}  // 불필요!
/>
```

**✅ 올바른 방법:**
- `next.config.ts`에 `unoptimized: true` 설정만 하면 됨
- 모든 Image 컴포넌트에 자동 적용됨

## 추가 확인 사항

### next.config.ts가 올바르게 배포되었는지 확인

Vercel 배포 로그에서:
```
Creating an optimized production build ...
```

이 메시지가 나오면 `unoptimized: true`가 적용되지 않은 것입니다.

올바른 경우:
```
Creating an optimized production build ...
⚠ Images are not optimized
```

또는 빌드 로그에서 이미지 최적화 관련 경고가 나와야 합니다.

## 여전히 문제가 발생한다면

1. **Vercel 환경 변수 확인**
   - `NEXT_PUBLIC_*` 변수가 올바르게 설정되어 있는지 확인

2. **빌드 로그 확인**
   - Vercel 배포 로그에서 오류 메시지 확인
   - `next.config.ts` 파싱 오류가 있는지 확인

3. **임시 해결책: 각 Image에 loader 추가**
   ```tsx
   <Image
     src={imageUrl}
     loader={({ src }) => src}  // 직접 URL 반환
   />
   ```
   하지만 이것은 권장하지 않습니다. `unoptimized: true`가 더 나은 방법입니다.

