'use client';

import { useEffect, useState } from 'react';
import { RankingEntry } from '@/types';

type RankingType = 'attendance' | 'study-time';

export default function RankingPage() {
  const [rankingType, setRankingType] = useState<RankingType>('attendance');
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now
    const mockData: RankingEntry[] = [
      { rank: 1, studentId: '30101', name: '김철수', grade: 1, value: 95, unit: '일' },
      { rank: 2, studentId: '30102', name: '이영희', grade: 1, value: 94, unit: '일' },
      { rank: 3, studentId: '30103', name: '박민준', grade: 1, value: 93, unit: '일' },
      { rank: 4, studentId: '30201', name: '최은지', grade: 2, value: 92, unit: '일' },
      { rank: 5, studentId: '30202', name: '정수현', grade: 2, value: 91, unit: '일' },
    ];
    setRankings(mockData);
    setLoading(false);
  }, [rankingType]);

  if (loading) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">출석 순위</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setRankingType('attendance')}
            className={`px-4 py-2 rounded-lg ${
              rankingType === 'attendance'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            출석일 순위
          </button>
          <button
            onClick={() => setRankingType('study-time')}
            className={`px-4 py-2 rounded-lg ${
              rankingType === 'study-time'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            공부시간 순위
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left">순위</th>
                <th className="px-4 py-3 text-left">이름</th>
                <th className="px-4 py-3 text-left">학년</th>
                <th className="px-4 py-3 text-right">점수</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((entry) => (
                <tr key={entry.rank} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="inline-block w-8 h-8 rounded-full bg-blue-600 text-white text-center leading-8 font-bold">
                      {entry.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">{entry.name}</td>
                  <td className="px-4 py-3">{entry.grade}학년</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {entry.value} {entry.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
