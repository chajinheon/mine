const HASH_SALT = process.env.NEXT_PUBLIC_HASH_SALT ?? 'hm_admin_2025';
const HASH_PREFIX = 'sha256:';

export const SESSION_KEY = 'stats_session_expiry';
export const AUTH_KEY = 'stats_auth';
export const ATTEMPTS_KEY = 'stats_attempts';
export const LOCKOUT_KEY = 'stats_lockout';
export const SESSION_TIMEOUT_MS = 15 * 60 * 1000;
export const MAX_ATTEMPTS = 10;
export const LOCKOUT_MS = 60 * 1000;

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + HASH_SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return HASH_PREFIX + hashArray.map((v) => v.toString(16).padStart(2, '0')).join('');
}

export async function verifyAdminPassword(input: string): Promise<boolean> {
  const stored = localStorage.getItem(AUTH_KEY);
  const defaultPw = process.env.NEXT_PUBLIC_STATS_ADMIN_PW ?? '';

  if (!stored) {
    // 최초 로그인: 환경변수 비밀번호와 비교
    return input === defaultPw;
  }

  if (stored.startsWith(HASH_PREFIX)) {
    return (await hashPassword(input)) === stored;
  }

  return input === defaultPw;
}

export async function persistPassword(pw: string): Promise<void> {
  localStorage.setItem(AUTH_KEY, await hashPassword(pw));
}

export function setSessionExpiry(): void {
  sessionStorage.setItem(SESSION_KEY, String(Date.now() + SESSION_TIMEOUT_MS));
}

export function clearSessionExpiry(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isSessionValid(): boolean {
  const expiry = parseInt(sessionStorage.getItem(SESSION_KEY) ?? '0');
  return Date.now() < expiry;
}

export function getLockoutState(): { locked: boolean; remainingMs: number } {
  const until = parseInt(sessionStorage.getItem(LOCKOUT_KEY) ?? '0');
  const remaining = until - Date.now();
  return { locked: remaining > 0, remainingMs: Math.max(0, remaining) };
}

export function recordFailedAttempt(): { locked: boolean } {
  const prev = parseInt(sessionStorage.getItem(ATTEMPTS_KEY) ?? '0');
  const next = prev + 1;
  sessionStorage.setItem(ATTEMPTS_KEY, String(next));
  if (next >= MAX_ATTEMPTS) {
    sessionStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_MS));
    sessionStorage.setItem(ATTEMPTS_KEY, '0');
    return { locked: true };
  }
  return { locked: false };
}

export function clearFailedState(): void {
  sessionStorage.setItem(ATTEMPTS_KEY, '0');
  sessionStorage.removeItem(LOCKOUT_KEY);
}
