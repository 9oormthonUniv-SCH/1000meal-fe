/* eslint-disable no-undef */
/* global importScripts, firebase */

// Firebase compat SDK (CDN)
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// 런타임 Firebase 설정 주입 (Next route)
importScripts("/firebase-config");

try {
  const config = self.__FIREBASE_CONFIG__ || {};
  if (config?.apiKey && config?.projectId && config?.messagingSenderId && config?.appId) {
    firebase.initializeApp(config);

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const title =
        payload?.notification?.title ||
        payload?.data?.title ||
        "새 알림";
      const body =
        payload?.notification?.body ||
        payload?.data?.body ||
        "";

      const data = payload?.data || {};

      self.registration.showNotification(title, {
        body,
        data,
      });
    });

    self.addEventListener("notificationclick", (event) => {
      event.notification?.close();
      event.waitUntil(
        (async () => {
          const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
          for (const c of allClients) {
            if ("focus" in c) {
              await c.focus();
              c.postMessage({ type: "OPEN_NOTIFICATION_PAGE" });
              return;
            }
          }
          await clients.openWindow("/notification");
        })()
      );
    });
  }
} catch (e) {
  // noop: SW에서 에러나도 앱 실행은 계속되게 둡니다.
}

