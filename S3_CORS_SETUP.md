# S3 CORS 및 Public Access 설정 가이드

EC2 → Vercel 이전 후 S3 이미지 접근 문제 해결을 위한 설정 가이드입니다.

## 문제 상황

Vercel 배포 환경에서 S3 이미지가 로드되지 않는 이유:
1. **Next.js Image Optimizer**: Vercel 서버가 `/_next/image?url=` 프록시를 통해 S3 이미지를 가져오려 하지만, S3 CORS 설정이 Vercel 도메인을 허용하지 않음
2. **Public Access**: 브라우저에서 직접 S3 이미지를 로드할 때 접근 권한 필요

## 해결 방법

### 1. S3 버킷 CORS 설정 (필수)

AWS S3 콘솔에서 버킷 `1000mealsql`의 **권한(Permissions)** → **CORS(Cross-origin resource sharing)** 설정:

**옵션 A: 모든 도메인 허용 (개발/테스트용)**
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

**옵션 B: 특정 도메인만 허용 (프로덕션 권장)**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "https://1000meal.store",
      "https://www.1000meal.store",
      "https://*.vercel.app"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

**설정 방법:**
1. AWS S3 콘솔 접속
2. `1000mealsql` 버킷 선택
3. **권한(Permissions)** 탭 클릭
4. **CORS(Cross-origin resource sharing)** 섹션에서 **편집(Edit)** 클릭
5. 위 JSON 설정 붙여넣기 (옵션 A 또는 B 선택)
6. **변경 사항 저장(Save changes)**

### 2. S3 버킷 Public Access 설정 (필수)

**권한(Permissions)** → **차단 퍼블릭 액세스 버킷 설정(Block public access)**:

- ✅ **모든 퍼블릭 액세스 차단** 해제 (또는 읽기 전용 허용)

**버킷 정책(Bucket Policy)** 추가:

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

**설정 방법:**
1. **권한(Permissions)** 탭에서 **버킷 정책(Bucket Policy)** 섹션
2. **편집(Edit)** 클릭
3. 위 JSON 설정 붙여넣기 (버킷 이름 확인: `1000mealsql`)
4. **변경 사항 저장(Save changes)**

### 3. Next.js 설정 확인

`next.config.ts`에 다음 설정이 되어 있는지 확인:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "1000mealsql.s3.ap-northeast-2.amazonaws.com",
      pathname: "/**",  // ⚠️ 이 부분이 중요!
    },
  ],
},
```

**⚠️ 중요**: `pathname: "/**"`가 없으면 400 오류가 발생합니다!

## 확인 방법

### 1. 브라우저에서 직접 테스트
```
https://1000mealsql.s3.ap-northeast-2.amazonaws.com/[이미지파일명]
```
위 URL을 브라우저에서 직접 열어서 이미지가 보이는지 확인

### 2. CORS 테스트
브라우저 개발자 도구 콘솔에서:
```javascript
fetch('https://1000mealsql.s3.ap-northeast-2.amazonaws.com/[이미지파일명]')
  .then(r => r.blob())
  .then(blob => console.log('✅ CORS OK', blob))
  .catch(e => console.error('❌ CORS Error', e))
```

### 3. Vercel 배포 후 확인
- 이미지가 정상적으로 로드되는지 확인
- 네트워크 탭에서 400 오류가 사라졌는지 확인

## 참고사항

- **보안**: Public Access를 허용하면 누구나 이미지 URL을 알면 접근 가능합니다. 민감한 이미지가 있다면 추가 인증이 필요합니다.
- **비용**: S3 데이터 전송 비용이 발생할 수 있습니다.
- **성능**: `unoptimized: true`로 설정했으므로 Next.js 이미지 최적화는 사용하지 않습니다. 필요시 CloudFront를 사용하여 성능을 개선할 수 있습니다.

