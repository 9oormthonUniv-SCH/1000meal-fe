# S3 CORS 설정 - 즉시 적용 가이드

## 현재 상황
- ✅ S3 이미지 직접 접근: 가능 (HTTP 200)
- ❌ CORS 헤더: 없음
- ❌ Vercel 이미지 최적화: 400 오류

## 즉시 해결 방법

### 1. AWS S3 콘솔 접속
1. https://console.aws.amazon.com/s3 접속
2. `1000mealsql` 버킷 선택

### 2. CORS 설정 추가

**경로:** 권한(Permissions) → CORS(Cross-origin resource sharing) → 편집(Edit)

**다음 JSON을 복사해서 붙여넣기:**

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD"
    ],
    "AllowedOrigins": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag",
      "Content-Length",
      "Content-Type"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

**저장 후 확인:**
- 변경 사항 저장(Save changes) 클릭
- 설정이 올바르게 저장되었는지 확인

### 3. Public Access 확인

**경로:** 권한(Permissions) → 차단 퍼블릭 액세스 버킷 설정(Block public access)

- ✅ **모든 퍼블릭 액세스 차단** 체크박스 **해제**
- 편집(Edit) 클릭 → 모든 체크박스 해제 → 변경 사항 저장

### 4. 버킷 정책 확인

**경로:** 권한(Permissions) → 버킷 정책(Bucket Policy) → 편집(Edit)

**다음 정책이 있는지 확인 (없으면 추가):**

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

### 5. 설정 확인

터미널에서 CORS 헤더 확인:

```bash
curl -I -H "Origin: https://1000meal.store" \
  "https://1000mealsql.s3.ap-northeast-2.amazonaws.com/dc0a5daa-4ed3-4df8-a1f0-f3d338c3c991.png" | grep -i "access-control"
```

**예상 결과:**
```
access-control-allow-origin: *
access-control-allow-methods: GET, HEAD
access-control-expose-headers: ETag, Content-Length, Content-Type
```

### 6. Vercel 재배포 (선택사항)

S3 설정 변경 후:
- 브라우저 캐시 클리어 (Ctrl+Shift+R 또는 Cmd+Shift+R)
- 또는 Vercel에서 재배포

## 중요 참고사항

### 왜 CORS가 필요한가?

Vercel의 이미지 최적화 서버(`/_next/image`)는:
1. 브라우저에서 요청을 받음
2. S3에서 원본 이미지를 다운로드
3. 이미지를 최적화 (리사이즈, 포맷 변환 등)
4. 최적화된 이미지를 브라우저에 반환

이 과정에서 브라우저가 S3에 직접 요청을 보내는 것은 아니지만, Vercel 서버가 S3에 요청할 때 CORS 헤더가 있으면 더 안정적으로 작동합니다.

### 보안 고려사항

현재 설정 (`"AllowedOrigins": ["*"]`)은 모든 도메인에서 접근을 허용합니다.

**프로덕션 환경에서는 특정 도메인만 허용하는 것을 권장:**

```json
"AllowedOrigins": [
  "https://1000meal.store",
  "https://www.1000meal.store",
  "https://*.vercel.app"
]
```

## 문제 해결 체크리스트

- [ ] S3 CORS 설정 완료
- [ ] Public Access 차단 해제
- [ ] 버킷 정책 설정 확인
- [ ] CORS 헤더 확인 (curl 명령어로)
- [ ] 브라우저 캐시 클리어
- [ ] Vercel 사이트에서 이미지 로드 확인

