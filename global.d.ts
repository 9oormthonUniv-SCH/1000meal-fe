// next/image 타입 완전 비활성화
declare module 'next/image' {
  export default function Image(props: any): JSX.Element;
}

declare global {
  interface Window {
    /** Firebase compat CDN 로드 시 주입되는 전역(firebase-app-compat) */
    firebase?: any;
  }
}

export {};