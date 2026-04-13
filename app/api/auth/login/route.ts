import { NextRequest, NextResponse } from 'next/server';

const HASH_SALT = process.env.HASH_SALT ?? 'hm_admin_2025';
const HASH_PREFIX = 'sha256:';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + HASH_SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return HASH_PREFIX + hashArray.map((v) => v.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { password?: string };
  const input = body.password ?? '';

  const expected = process.env.STATS_ADMIN_PW ?? '';

  if (!expected) {
    return NextResponse.json({ ok: false, error: '\uc11c\ubc84 \ud658\uacbd\ubcc0\uc218 \ubbf8\uc124\uc815' }, { status: 500 });
  }

  const ok = input === expected;

  if (!ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('stats_session', 'valid', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15, // 15분
    path: '/',
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('stats_session');
  return response;
}
