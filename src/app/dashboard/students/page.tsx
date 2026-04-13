'use client';

import { useEffect, useState } from 'react';
import { Student } from '@/types';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockStudents: Student[] = [
      { id: '1', studentId: '30101', name: '김철수', grade: 1, classNum: 1, number: 1 },
      { id: '2', studentId: '30102', name: '이영희', grade: 1, classNum: 1, number: 2 },
      { id: '3', studentId: '30201', name: '박민준', grade: 2, classNum: 1, number: 1 },
      { id: '4', studentId: '30202', name: '최은지', grade: 2, classNum: 1, number: 2 },
    ];
    setStudents(mockStudents);
    setLoading(false);
  }, []);

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.includes(searchQuery) || s.studentId.includes(searchQuery);
    const matchGrade = gradeFilter === 'all' || s.grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  if (loading) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">학생 관리</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="이름 또는 학번 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">전체 학년</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left">학번</th>
                <th className="px-4 py-3 text-left">이름</th>
                <th className="px-4 py-3 text-left">학년</th>
                <th className="px-4 py-3 text-left">반</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{student.studentId}</td>
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3">{student.grade}학년</td>
                  <td className="px-4 py-3">{student.classNum}반</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
