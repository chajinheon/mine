'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { DailyStats } from '@/types';

export default function OverviewPage() {
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const response = await fetch(`/api/stats/daily?date=${today}`);

        if (!response.ok) {
          throw new Error('통계 데이터를 불러올 수 없습니다');
        }

        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message || '오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">오류</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-blue-800">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">오늘의 출석 현황</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium">출석</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{stats.presentCount}</p>
          <p className="text-gray-500 text-xs mt-2">명</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm font-medium">결석</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{stats.absentCount}</p>
          <p className="text-gray-500 text-xs mt-2">명</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-medium">전체 인원</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{stats.totalStudents}</p>
          <p className="text-gray-500 text-xs mt-2">명</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm font-medium">출석률</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {stats.attendanceRate.toFixed(1)}%
          </p>
          <p className="text-gray-500 text-xs mt-2">오늘</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">학년별 출석률</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats.byGrade).map(([grade, gradeStats]) => (
            <div key={grade} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
              <p className="text-gray-700 font-medium">{grade}학년</p>
              <div className="mt-3 flex items-end gap-3">
                <p className="text-3xl font-bold text-blue-600">
                  {gradeStats.rate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">
                  {gradeStats.present}/{gradeStats.total}명
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
