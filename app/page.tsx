'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  verifyAdminPassword,
  setSessionExpiry,
  isSessionValid,
  getLockoutState,
  recordFailedAttempt,
  clearFailedState,
} from '@/lib/auth';
import { Shield, Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockout, setLockout] = useState<{ locked: boolean; remainingMs: number }>({
    locked: false,
    remainingMs: 0,
  });

  // 세션이 유효하면 대시보드로 리다이렉트
  useEffect(() => {
    if (isSessionValid()) router.replace('/dashboard');
  }, [router]);

  useEffect(() => {
    if (!lockout.locked) return;
    const interval = setInterval(() => {
      const next = getLockoutState();
      setLockout(next);
      if (!next.locked) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockout.locked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const current = getLockoutState();
    if (current.locked) {
      setLockout(current);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const ok = await verifyAdminPassword(pw);
      if (ok) {
        clearFailedState();
        setSessionExpiry();
        router.replace('/dashboard');
      } else {
        const result = recordFailedAttempt();
        if (result.locked) {
          setLockout(getLockoutState());
          setError('로그인 시도 횟수를 초과하여 1분간 잠기습니다.');
        } else {
          setError('비밀번호가 맞지 않습니다.');
        }
        setPw('');
      }
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    }
    setLoading(false);
  };

  const remainingSec = Math.ceil(lockout.remainingMs / 1000);

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">학생 출석 통계</h1>
          <p className="text-blue-200 text-sm mt-1">관리자 로그인이 필요합니다</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                관리자 비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pw}
                  onChange={(e) => { setPw(e.target.value); setError(''); }}
                  placeholder="비밀번호 입력"
                  disabled={lockout.locked || loading}
                  className="input pl-10 pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {lockout.locked && (
              <div className="text-center text-sm text-amber-700 bg-amber-50 rounded-xl px-3 py-2.5">
                {remainingSec}초 후 다시 시도하세요
              </div>
            )}

            <button
              type="submit"
              disabled={loading || lockout.locked || !pw}
              className="btn-primary w-full mt-2"
            >
              {loading ? '...' : '로그인'}
            </button>
          </form>
        </div>

        <p className="text-center text-blue-200 text-xs mt-6">
          세션은 15분 미활동 시 자동 만료됩니다
        </p>
      </div>
    </div>
  );
}
