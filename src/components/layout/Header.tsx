'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function Header() {
  const now = new Date();
  const today = format(now, 'yyyy년 MM월 dd일 (EEEE)', { locale: ko });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">출석 통계 대시보드</h1>
          <p className="text-sm text-gray-500 mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">관리자</p>
            <p className="text-xs text-gray-400">Anonymous</p>
          </div>
        </div>
      </div>
    </header>
  );
}
