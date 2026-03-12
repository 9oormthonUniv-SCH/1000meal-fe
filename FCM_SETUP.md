# FCM(Web Push) 설정 가이드

이 프로젝트의 웹 푸시(FCM) 동작을 위해서는 **Firebase Web App 설정값**과 **VAPID 키**가 필요합니다.

## 1) `.env.local`에 추가할 값

Firebase 콘솔에서 제공한 `firebaseConfig`를 아래 env로 매핑하세요.

```text
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyA9zsdo5AgpAIRWOd1YkvWFyMyjm7WvAzc"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="bab-2fc1b.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="bab-2fc1b"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="bab-2fc1b.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="548667427482"
NEXT_PUBLIC_FIREBASE_APP_ID="1:548667427482:web:6ff1868ced55b634d46d23"
NEXT_PUBLIC_FIREBASE_VAPID_KEY="BAMOvYe33mebTtshoqCv1SHBxD_fOy2sJxalfjliXqBwQapX5Eh6mS1qXfAkf47_eYQ1P6RnomtF0zRewtEpmdM"
```

> `measurementId`는 푸시에 필수는 아니어서 env에 없어도 됩니다.

## 2) FCM 테스트 서버 프록시(HTTP 업스트림)

FCM 관련 백엔드가 HTTP(`http://15.164.105.225:8080`)만 제공하는 경우,
브라우저 mixed content/CORS 회피를 위해 프론트는 `/api/v1/fcm/*`로 호출하고,
Next Route Handler가 업스트림으로 프록시합니다.

업스트림을 바꾸고 싶으면 서버 env로 아래를 설정하세요(선택):

```text
FCM_API_URL="http://15.164.105.225:8080"
```

## 3) 적용 방법

- `.env.local` 변경 후에는 **`npm run dev`를 재시작**해야 합니다.

