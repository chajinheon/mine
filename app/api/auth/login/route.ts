import { NextResponse } from 'next/server';

// 로그인이 제거되어 사용되지 않습니다.
export async function GET() {
  return NextResponse.json({ ok: true });
}
