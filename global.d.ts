// next/image 타입 완전 비활성화
declare module 'next/image' {
  export default function Image(props: any): JSX.Element;
}