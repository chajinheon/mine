import { Student, AttendanceEntry, DailyStats } from '@/types';
import { isWeekday } from 'date-fns/locale';
import { parseISO, isMonday, isFriday } from 'date-fns';

export function parseDurationToMinutes(duration?: string): number {
  if (!duration) return 0;
  const match = duration.match(/(\d+)h\s*(\d+)?m?/);
  if (!match) return 0;
  const hours = parseInt(match[1], 10) || 0;
  const minutes = parseInt(match[2], 10) || 0;
  return hours * 60 + minutes;
}

export function isKoreanWeekday(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5; // 월~금
}

export function calculateDailyStats(
  date: string,
  students: Student[],
  attendanceEntries: AttendanceEntry[]
): DailyStats {
  const presentStudents = new Set<string>();
  const byGrade: Record<number, { total: number; present: number; rate: number }> = {
    1: { total: 0, present: 0, rate: 0 },
    2: { total: 0, present: 0, rate: 0 },
    3: { total: 0, present: 0, rate: 0 },
  };

  // 학년별 전체 학생 수
  students.forEach((student) => {
    byGrade[student.grade].total++;
  });

  // 출석한 학생 찾기
  attendanceEntries.forEach((entry) => {
    if (entry.entryType === 'checkin') {
      presentStudents.add(entry.studentId);
    }
  });

  // 학년별 출석 수 계산
  students.forEach((student) => {
    if (presentStudents.has(student.studentId)) {
      byGrade[student.grade].present++;
    }
  });

  // 출석률 계산
  Object.entries(byGrade).forEach(([grade, data]) => {
    if (data.total > 0) {
      data.rate = (data.present / data.total) * 100;
    }
  });

  const totalPresent = presentStudents.size;
  const totalStudents = students.length;
  const attendanceRate = totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0;

  return {
    date,
    totalStudents,
    presentCount: totalPresent,
    absentCount: totalStudents - totalPresent,
    attendanceRate,
    byGrade,
  };
}
