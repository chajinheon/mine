import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 비밀번호 없이 누구나 /dashboard에 접근 가능합니다.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
