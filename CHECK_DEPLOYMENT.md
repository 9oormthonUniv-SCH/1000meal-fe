# 배포 상태 확인 가이드

## 현재 문제
- `/_next/image?url=...` 요청이 여전히 발생
- `unoptimized: true` 설정이 적용되지 않은 것으로 보임

## 확인 사항

### 1. Vercel 배포 상태 확인

**Vercel 대시보드에서:**
1. 프로젝트 페이지 접속
2. "Deployments" 탭 확인
3. 최신 배포가 **완료(Ready)** 상태인지 확인
4. 배포 시간이 `next.config.ts` 수정 이후인지 확인

### 2. 빌드 로그 확인

**Vercel 배포 로그에서 확인:**
```
Creating an optimized production build ...
```

이 메시지가 나오면 정상입니다. 하지만 다음 경고가 있어야 합니다:
```
⚠ Images are not optimized
```

또는 빌드 로그에서:
```
> next build
...
⚠ Images are not optimized
```

### 3. 로컬에서 빌드 테스트

로컬에서 빌드하여 확인:

```bash
npm run build
```

**예상 출력:**
```
> next build
...
⚠ Images are not optimized
...
✓ Compiled successfully
```

### 4. 브라우저에서 확인

**개발자 도구 → Network 탭:**
- `/_next/image?url=...` 요청이 **없어야** 함
- `https://1000mealsql.s3.ap-northeast-2.amazonaws.com/...` 직접 요청이 **있어야** 함

### 5. 실제 이미지 URL 확인

**브라우저 콘솔에서:**
```javascript
// 실제 이미지 URL 확인
const img = document.querySelector('img[src*="1000mealsql"]');
console.log('Image src:', img?.src);

// 또는 모든 이미지 확인
document.querySelectorAll('img').forEach((img, i) => {
  if (img.src.includes('1000mealsql')) {
    console.log(`Image ${i}:`, img.src);
  }
});
```

**예상 결과 (`unoptimized: true` 적용 시):**
```
Image src: https://1000mealsql.s3.ap-northeast-2.amazonaws.com/...
```

**잘못된 결과 (설정 미적용):**
```
Image src: https://1000meal.store/_next/image?url=https%3A%2F%2F...
```

## 해결 방법

### 방법 1: Vercel 빌드 캐시 클리어

1. Vercel 대시보드 → 프로젝트 설정
2. "Clear Build Cache" 클릭
3. 재배포

### 방법 2: 강제 재배포

```bash
git commit --allow-empty -m "Force redeploy"
git push
```

### 방법 3: next.config.ts 확인

파일이 올바르게 저장되었는지 확인:

```bash
cat next.config.ts | grep -A 5 "images:"
```

**예상 출력:**
```
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
```

## URL 인코딩 문제 해결

`normalizeImageUrl` 함수를 개선하여 완전히 인코딩된 URL도 처리하도록 수정했습니다.

**백엔드에서 보내는 URL 형식 확인:**
- 정상: `https://1000mealsql.s3.ap-northeast-2.amazonaws.com/image.png`
- 문제: `https%3A%2F%2F1000mealsql.s3.ap-northeast-2.amazonaws.com%2Fimage.png`

백엔드에서 완전히 인코딩된 URL을 보내고 있다면, 백엔드 수정이 필요할 수 있습니다.

