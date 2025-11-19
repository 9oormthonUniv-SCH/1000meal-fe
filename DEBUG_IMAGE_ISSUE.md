# 이미지 400 오류 디버깅 가이드

## 현재 상황
- Next.js 설정: ✅ 올바름 (`pathname: "/**"` 포함)
- 코드 수정: ✅ 완료 (imageUrl 정규화 적용)
- **문제**: 여전히 `/_next/image?url=...` 400 오류 발생

## 원인 진단

### 1. S3 CORS 설정 확인 (가장 가능성 높음)

**확인 방법:**
1. AWS S3 콘솔 접속
2. `1000mealsql` 버킷 선택
3. **권한(Permissions)** → **CORS(Cross-origin resource sharing)** 확인

**필요한 설정:**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "https://1000meal.store",
      "https://*.vercel.app"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

**또는 테스트용 (모든 도메인 허용):**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### 2. S3 Public Access 확인

**확인 방법:**
1. **권한(Permissions)** → **차단 퍼블릭 액세스 버킷 설정**
2. **모든 퍼블릭 액세스 차단**이 **해제**되어 있어야 함

**버킷 정책 확인:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::1000mealsql/*"
    }
  ]
}
```

### 3. 실제 이미지 URL 확인

**브라우저 개발자 도구에서:**
1. Network 탭 열기
2. 실패한 `/_next/image?url=...` 요청 클릭
3. **Request URL** 또는 **Query String Parameters**에서 실제 S3 URL 확인

**예상되는 URL 형식:**
```
https://1000mealsql.s3.ap-northeast-2.amazonaws.com/dc0a5daa-4ed3-4df8-a1f0-f3d338c3c991.png
```

### 4. 직접 S3 URL 테스트

**브라우저에서 직접 열기:**
```
https://1000mealsql.s3.ap-northeast-2.amazonaws.com/[실제이미지파일명]
```

**결과:**
- ✅ 이미지가 보임 → S3 Public Access는 정상, CORS 문제일 가능성
- ❌ Access Denied → S3 Public Access 설정 필요
- ❌ CORS 오류 → S3 CORS 설정 필요

### 5. Vercel 서버에서 S3 접근 테스트

**문제:** Vercel의 이미지 최적화 서버가 S3에 직접 접근할 때:
- S3 CORS 설정이 Vercel 서버 IP를 허용해야 함
- 하지만 Vercel은 동적 IP를 사용하므로, `AllowedOrigins`에 Vercel 도메인을 추가해야 함

**해결:**
- CORS 설정에서 `"AllowedOrigins": ["*"]` 사용 (테스트용)
- 또는 `"AllowedOrigins": ["https://1000meal.store", "https://*.vercel.app"]` 사용

## 즉시 확인할 사항

### 체크리스트

- [ ] S3 CORS 설정이 완료되었는가?
- [ ] S3 Public Access가 활성화되어 있는가?
- [ ] 버킷 정책이 올바르게 설정되어 있는가?
- [ ] 브라우저에서 직접 S3 URL을 열 수 있는가?
- [ ] Vercel 배포가 최신 설정으로 재배포되었는가?

## 다음 단계

1. **S3 설정 완료 후** Vercel에서 재배포
2. 브라우저 캐시 클리어 (Ctrl+Shift+R 또는 Cmd+Shift+R)
3. 다시 테스트

## 추가 디버깅

**브라우저 콘솔에서 실행:**
```javascript
// 실제 이미지 URL 확인
const img = document.querySelector('img[src*="1000mealsql"]');
console.log('Image URL:', img?.src);

// CORS 테스트
fetch('https://1000mealsql.s3.ap-northeast-2.amazonaws.com/[이미지파일명]')
  .then(r => {
    console.log('Status:', r.status);
    console.log('Headers:', [...r.headers.entries()]);
    return r.blob();
  })
  .then(blob => console.log('✅ CORS OK', blob))
  .catch(e => console.error('❌ CORS Error', e));
```

