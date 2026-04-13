'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { getDb } from '@/lib/firebase';
import {
  fetchAllStudents,
  fetchRecentAttendance,
  fetchAttendanceByDate,
} from '@/lib/firestore';
import {
  buildStudentStats,
  buildDailyAttendance,
  buildGradeStats,
} from '@/lib/stats';
import type { Student, AttendanceEntry, StudentStats, DailyAttendance, GradeStats } from '@/lib/types';
import OverviewCards from '@/components/OverviewCards';
import GradeStatsRow from '@/components/GradeStatsRow';
import AttendanceChart from '@/components/AttendanceChart';
import StudentTable from '@/components/StudentTable';
import TodayLog from '@/components/TodayLog';
import {
  LayoutDashboard,
  Users,
  History,
  LogOut,
  RefreshCw,
  GraduationCap,
} from 'lucide-react';

type Tab = 'overview' | 'students' | 'today';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [todayEntries, setTodayEntries] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');
  const thisMonth = format(new Date(), 'yyyy-MM');

  const loadData = useCallback(async () => {
    const db = getDb();
    if (!db) return;
    setLoading(true);
    try {
      const [studs, recent, todayLogs] = await Promise.all([
        fetchAllStudents(db),
        fetchRecentAttendance(db, 60),
        fetchAttendanceByDate(db, today),
      ]);
      setStudents(studs);
      setEntries(recent);
      setTodayEntries(todayLogs);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [today]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.replace('/');
  };

  const allEntries = [...entries, ...todayEntries.filter((e) => !entries.find((x) => x.id === e.id))];
  const studentStats: StudentStats[] = buildStudentStats(students, allEntries, thisMonth);
  const dailyAttendance: DailyAttendance[] = buildDailyAttendance(allEntries);
  const gradeStats: GradeStats[] = buildGradeStats(students, allEntries, today);

  const checkinSet = new Set(
    todayEntries
      .filter((e) => e.entryType === 'checkin' || e.id?.endsWith('_in'))
      .map((e) => e.studentId)
  );
  const checkoutSet = new Set(
    todayEntries
      .filter((e) => e.entryType === 'checkout' || e.id?.endsWith('_out'))
      .map((e) => e.studentId)
  );

  const todayPresent = checkinSet.size;
  const todayCheckout = checkoutSet.size;
  const currentlyIn = todayPresent - todayCheckout;

  const navItems: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: '개요', icon: LayoutDashboard },
    { key: 'today', label: '오늘 출석', icon: History },
    { key: 'students', label: '학생별 통계', icon: Users },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#f0f4ff' }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">출석 통계</div>
            <div className="text-xs text-slate-400">{today}</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100 space-y-0.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 p-8 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {navItems.find((n) => n.key === activeTab)?.label}
            </h1>
            {lastUpdated && (
              <p className="text-sm text-slate-400 mt-0.5">
                마지막 업데이트: {format(lastUpdated, 'HH:mm:ss')}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-slate-200 text-sm text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            전체 학생 {students.length}명
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <span className="text-sm">데이터를 불러오는 중...</span>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <OverviewCards
                  totalStudents={students.length}
                  todayPresent={todayPresent}
                  currentlyIn={currentlyIn}
                  todayAbsent={students.length - todayPresent}
                  todayCheckout={todayCheckout}
                />
                <GradeStatsRow stats={gradeStats} totalStudents={students.length} />
                <AttendanceChart data={dailyAttendance} />
              </div>
            )}
            {activeTab === 'today' && (
              <TodayLog entries={todayEntries} students={students} today={today} />
            )}
            {activeTab === 'students' && (
              <StudentTable stats={studentStats} thisMonth={thisMonth} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
