'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Calendar,
  TrendingUp,
  Users,
  Award,
  Zap,
  LayoutGrid,
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { href: '/dashboard/overview', label: '개요', icon: LayoutGrid },
  { href: '/dashboard/daily', label: '일일 출석', icon: Calendar },
  { href: '/dashboard/weekly', label: '주간 통계', icon: BarChart3 },
  { href: '/dashboard/monthly', label: '월간 통계', icon: TrendingUp },
  { href: '/dashboard/grades', label: '학년별 비교', icon: Users },
  { href: '/dashboard/ranking', label: '출석 순위', icon: Award },
  { href: '/dashboard/students', label: '학생 상세', icon: Users },
  { href: '/dashboard/points', label: '포인트', icon: Zap },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white min-h-screen p-4 shadow-lg">
      <div className="mb-8">
        <h2 className="text-xl font-bold">📊 Dashboard</h2>
        <p className="text-xs text-blue-100 mt-1">Attendance Stats</p>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-white text-blue-600 font-semibold'
                  : 'text-blue-100 hover:bg-blue-500'
              )}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
