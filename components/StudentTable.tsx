'use client';

import { useState, useMemo } from 'react';
import type { StudentStats } from '@/lib/types';
import { formatMinutes } from '@/lib/stats';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface Props {
  stats: StudentStats[];
  thisMonth: string;
}

type SortKey = 'name' | 'grade' | 'totalDays' | 'thisMonthDays' | 'avgStudyMinutes' | 'lastAttendance';
type SortDir = 'asc' | 'desc';

export default function StudentTable({ stats, thisMonth }: Props) {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('grade');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const filtered = useMemo(() => {
    let list = stats;
    if (gradeFilter !== 'all') {
      list = list.filter((s) => String(s.student.grade) === gradeFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.student.name.toLowerCase().includes(q) ||
          s.student.studentId.includes(q)
      );
    }
    return [...list].sort((a, b) => {
      let va: string | number, vb: string | number;
      switch (sortKey) {
        case 'name': va = a.student.name; vb = b.student.name; break;
        case 'grade': va = a.student.grade * 100 + a.student.classNum * 10 + a.student.number; vb = b.student.grade * 100 + b.student.classNum * 10 + b.student.number; break;
        case 'totalDays': va = a.totalDays; vb = b.totalDays; break;
        case 'thisMonthDays': va = a.thisMonthDays; vb = b.thisMonthDays; break;
        case 'avgStudyMinutes': va = a.avgStudyMinutes; vb = b.avgStudyMinutes; break;
        case 'lastAttendance': va = a.lastAttendance ?? ''; vb = b.lastAttendance ?? ''; break;
        default: va = 0; vb = 0;
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [stats, search, gradeFilter, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" />
      : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />;
  };

  const [yearStr, monthStr] = thisMonth.split('-');

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-5 border-b border-slate-100">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름 또는 학번 검색"
            className="input pl-9 text-sm"
          />
        </div>
        <div className="flex gap-1">
          {(['all', '1', '2', '3'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                gradeFilter === g
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g === 'all' ? '전체' : `${g}학년`}
            </button>
          ))}
        </div>
        <span className="text-sm text-slate-400 ml-auto">{filtered.length}명</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {([
                { key: 'grade', label: '학년/반/번호' },
                { key: 'name', label: '이름' },
                { key: 'totalDays', label: '누적 출석(60일)' },
                { key: 'thisMonthDays', label: `${monthStr}월 출석` },
                { key: 'avgStudyMinutes', label: '평균 공부시간' },
                { key: 'lastAttendance', label: '마지막 출석' },
              ] as { key: SortKey; label: string }[]).map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-500 cursor-pointer hover:text-slate-700 select-none"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <SortIcon col={key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ student, totalDays, thisMonthDays, avgStudyMinutes, lastAttendance }) => (
              <tr key={student.studentId} className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors">
                <td className="px-4 py-3 text-sm text-slate-600">
                  {student.grade}학년 {student.classNum}반 {student.number}번
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-slate-800 text-sm">{student.name}</span>
                  <span className="ml-1.5 text-xs text-slate-400">{student.studentId}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">{totalDays}일</span>
                    <div className="flex-1 max-w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-400 rounded-full"
                        style={{ width: `${Math.min(100, (totalDays / 60) * 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`font-semibold ${
                    thisMonthDays >= 20 ? 'text-emerald-600' :
                    thisMonthDays >= 10 ? 'text-blue-600' :
                    thisMonthDays >= 5 ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    {thisMonthDays}일
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {avgStudyMinutes > 0 ? formatMinutes(avgStudyMinutes) : <span className="text-slate-300">-</span>}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {lastAttendance ?? <span className="text-slate-300">-</span>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                  해당하는 학생이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
