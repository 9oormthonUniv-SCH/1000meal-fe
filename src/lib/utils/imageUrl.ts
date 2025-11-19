/**
 * S3 이미지 URL 정규화 유틸리티
 * 백엔드에서 잘못 인코딩된 URL을 수정
 * 
 * 문제 예시:
 * - https://1000mealsql.s3.ap-northeast-2.amazonaws.com/%2Fimage.png (잘못된 인코딩)
 * - https://1000mealsql.s3.ap-northeast-2.amazonaws.com/image.png (올바른 형식)
 * - https%3A%2F%2F1000mealsql... (완전히 인코딩된 URL)
 */
export function normalizeImageUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;

  try {
    // 완전히 인코딩된 URL인지 확인 (https%3A%2F%2F로 시작)
    let decodedUrl = url;
    if (url.startsWith('https%3A%2F%2F') || url.includes('%3A%2F%2F')) {
      // URL 디코딩
      decodedUrl = decodeURIComponent(url);
    }
    
    // URL이 이미 올바른 형식인지 확인
    const parsedUrl = new URL(decodedUrl);
    
    // pathname에서 이중 인코딩된 슬래시 제거
    // 예: /%2Fimage.png -> /image.png
    const normalizedPathname = parsedUrl.pathname
      .replace(/%2F/g, '/')  // %2F를 /로 변환
      .replace(/\/+/g, '/')  // 연속된 슬래시를 하나로
      .replace(/^\/\//, '/'); // 시작 부분의 이중 슬래시 제거
    
    // 정규화된 URL 재구성
    const normalizedUrl = `${parsedUrl.protocol}//${parsedUrl.host}${normalizedPathname}${parsedUrl.search}${parsedUrl.hash}`;
    
    return normalizedUrl;
  } catch (error) {
    // URL 파싱 실패 시 원본 반환
    console.warn('Failed to normalize image URL:', url, error);
    return url;
  }
}

