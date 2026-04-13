'use client';

import { useMemo } from 'react';
import type { AttendanceEntry, Student } from '@/lib/types';
import { format } from 'date-fns';
import { LogIn, LogOut, Clock } from 'lucide-react';

interface Props {
  entries: AttendanceEntry[];
  students: Student[];
  today: string;
}

interface SessionRow {
  studentId: string;
  studentName: string;
  grade: number;
  classNum: number;
  number: number;
  checkinTime: string | null;
  checkoutTime: string | null;
  studyDuration: string | null;
  type: 'scan' | 'keypad';
  status: 'in' | 'out';
}

function tsToTime(ts: unknown): string | null {
  if (!ts) return null;
  try {
    const d = (ts as { toDate: () => Date }).toDate();
    return format(d, 'HH:mm');
  } catch { return null; }
}

export default function TodayLog({ entries, students, today }: Props) {
  const sessions = useMemo<SessionRow[]>(() => {
    const checkins = new Map<string, AttendanceEntry>();
    const checkouts = new Map<string, AttendanceEntry>();

    for (const e of entries) {
      const isIn = e.entryType === 'checkin' || e.id?.endsWith('_in');
      const isOut = e.entryType === 'checkout' || e.id?.endsWith('_out');
      if (isIn) checkins.set(e.studentId, e);
      if (isOut) checkouts.set(e.studentId, e);
    }

    const ids = new Set([...checkins.keys(), ...checkouts.keys()]);
    return Array.from(ids).map((sid) => {
      const cin = checkins.get(sid);
      const cout = checkouts.get(sid);
      const student = students.find((s) => s.studentId === sid);
      return {
        studentId: sid,
        studentName: cin?.studentName ?? cout?.studentName ?? sid,
        grade: student?.grade ?? cin?.grade ?? 0,
        classNum: student?.classNum ?? 0,
        number: student?.number ?? 0,
        checkinTime: tsToTime(cin?.timestamp),
        checkoutTime: tsToTime(cout?.timestamp),
        studyDuration: cout?.studyDuration ?? null,
        type: cin?.type ?? cout?.type ?? 'keypad',
        status: cout ? 'out' : 'in',
      };
    }).sort((a, b) => {
      if (a.grade !== b.grade) return a.grade - b.grade;
      if (a.classNum !== b.classNum) return a.classNum - b.classNum;
      return a.number - b.number;
    });
  }, [entries, students]);

  const inCount = sessions.filter((s) => s.status === 'in').length;
  const outCount = sessions.filter((s) => s.status === 'out').length;

  return (
    <div className="space-y-4">
      {/* Summary chips */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 font-semibold text-sm px-4 py-2 rounded-xl">
          <LogIn className="w-4 h-4" /> 입실 중 {inCount}명
        </div>
        <div className="flex items-center gap-2 bg-violet-50 text-violet-700 font-semibold text-sm px-4 py-2 rounded-xl">
          <LogOut className="w-4 h-4" /> 퇴실 {outCount}명
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['학년/반/번', '이름', '입실 시각', '퇴실 시각', '공부 시간', '입력 방식', '상태'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.studentId} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {s.grade}학년 {s.classNum}반 {s.number}번
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800 text-sm">{s.studentName}</td>
                  <td className="px-4 py-3 text-sm">
                    {s.checkinTime
                      ? <span className="flex items-center gap-1.5 text-emerald-700"><LogIn className="w-3.5 h-3.5" />{s.checkinTime}</span>
                      : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {s.checkoutTime
                      ? <span className="flex items-center gap-1.5 text-violet-700"><LogOut className="w-3.5 h-3.5" />{s.checkoutTime}</span>
                      : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {s.studyDuration
                      ? <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-400" />{s.studyDuration}</span>
                      : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      s.type === 'scan' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {s.type === 'scan' ? '스캔' : '입력'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      s.status === 'in'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {s.status === 'in' ? '● 입실 중' : '퇴실'}
                    </span>
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                    오늘 출석 기록이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
