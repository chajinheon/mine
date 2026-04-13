'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { DailyStats } from '@/types';

export default function DailyPage() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/stats/daily?date=${date}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">일일 출석 통계</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '로딩...' : '조회'}
          </button>
        </div>
      </div>

      {stats && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-600 text-sm">출석</p>
              <p className="text-3xl font-bold text-green-600">{stats.presentCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-600 text-sm">결석</p>
              <p className="text-3xl font-bold text-red-600">{stats.absentCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-600 text-sm">전체</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-600 text-sm">출석률</p>
              <p className="text-3xl font-bold text-purple-600">{stats.attendanceRate.toFixed(1)}%</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">학년별 출석률</h3>
            <div className="space-y-3">
              {Object.entries(stats.byGrade).map(([grade, data]) => (
                <div key={grade} className="flex items-center justify-between">
                  <div className="w-20">{grade}학년</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 mx-4 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full"
                      style={{ width: `${data.rate}%` }}
                    />
                  </div>
                  <div className="w-32 text-right">
                    {data.rate.toFixed(1)}% ({data.present}/{data.total})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
