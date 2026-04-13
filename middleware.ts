import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * /dashboard 라우트는 서버측에서 쿿키 유효성을 요구합니다.
 * 세션 만료 보안은 sessionStorage를 사용하므로
 * 커스텀 쿿키 방식으로 추가 보호합니다.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /dashboard 이하 라우트 보호
  if (pathname.startsWith('/dashboard')) {
    const session = request.cookies.get('stats_session')?.value;
    if (!session || session !== 'valid') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
