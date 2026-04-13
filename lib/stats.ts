import { format } from 'date-fns';
import type { Student, AttendanceEntry, StudentStats, DailyAttendance, GradeStats } from './types';

/** studyDuration 문자열("1시간 23분" 등)을 분으로 변환 */
export function parseDurationToMinutes(duration?: string): number {
  if (!duration) return 0;
  let total = 0;
  const hourMatch = duration.match(/(\d+)시간/);
  const minMatch = duration.match(/(\d+)분/);
  if (hourMatch) total += parseInt(hourMatch[1]) * 60;
  if (minMatch) total += parseInt(minMatch[1]);
  return total;
}

export function formatMinutes(minutes: number): string {
  if (minutes <= 0) return '0분';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

/** 출석 엔트리에서 입실 기록만 추출해 학생별 통계 계산 */
export function buildStudentStats(
  students: Student[],
  entries: AttendanceEntry[],
  thisMonth: string
): StudentStats[] {
  const checkinsByStudent = new Map<string, AttendanceEntry[]>();
  const checkoutsByKey = new Map<string, AttendanceEntry>();

  for (const entry of entries) {
    if (entry.entryType === 'checkout' || entry.id?.endsWith('_out')) {
      checkoutsByKey.set(`${entry.studentId}_${entry.date}`, entry);
    } else {
      const list = checkinsByStudent.get(entry.studentId) ?? [];
      list.push(entry);
      checkinsByStudent.set(entry.studentId, list);
    }
  }

  return students.map((student) => {
    const checkins = checkinsByStudent.get(student.studentId) ?? [];
    const dates = [...new Set(checkins.map((e) => e.date))].sort();
    const thisMonthDays = dates.filter((d) => d.startsWith(thisMonth)).length;

    let totalStudyMinutes = 0;
    for (const date of dates) {
      const checkout = checkoutsByKey.get(`${student.studentId}_${date}`);
      if (checkout?.studyDuration) {
        totalStudyMinutes += parseDurationToMinutes(checkout.studyDuration);
      }
    }

    const checkinTimes = checkins
      .filter((e) => e.timestamp)
      .map((e) => {
        try {
          const ts = (e.timestamp as unknown as { toDate: () => Date }).toDate();
          return format(ts, 'HH:mm');
        } catch {
          return '';
        }
      })
      .filter(Boolean);

    return {
      student,
      totalDays: dates.length,
      totalStudyMinutes,
      avgStudyMinutes: dates.length > 0 ? Math.round(totalStudyMinutes / dates.length) : 0,
      lastAttendance: dates.length > 0 ? dates[dates.length - 1] : null,
      thisMonthDays,
      checkinTimes,
    };
  });
}

/** 날짜별 출석 집계 */
export function buildDailyAttendance(entries: AttendanceEntry[]): DailyAttendance[] {
  const map = new Map<string, DailyAttendance>();
  const studentDateSet = new Set<string>();

  for (const entry of entries) {
    if (!map.has(entry.date)) {
      map.set(entry.date, { date: entry.date, presentCount: 0, checkinCount: 0, checkoutCount: 0 });
    }
    const day = map.get(entry.date)!;
    const isCheckin = entry.entryType === 'checkin' || entry.id?.endsWith('_in');
    const isCheckout = entry.entryType === 'checkout' || entry.id?.endsWith('_out');

    if (isCheckin) {
      day.checkinCount++;
      const key = `${entry.studentId}_${entry.date}`;
      if (!studentDateSet.has(key)) {
        studentDateSet.add(key);
        day.presentCount++;
      }
    } else if (isCheckout) {
      day.checkoutCount++;
    }
  }

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

/** 학년별 통계 */
export function buildGradeStats(
  students: Student[],
  entries: AttendanceEntry[],
  today: string
): GradeStats[] {
  const todayCheckins = new Set(
    entries
      .filter((e) => e.date === today && (e.entryType === 'checkin' || e.id?.endsWith('_in')))
      .map((e) => e.studentId)
  );

  return [1, 2, 3].map((grade) => {
    const gradeStudents = students.filter((s) => s.grade === grade);
    const presentToday = gradeStudents.filter((s) => todayCheckins.has(s.studentId)).length;

    const checkinsByGrade = entries.filter(
      (e) => e.grade === grade && (e.entryType === 'checkin' || e.id?.endsWith('_in'))
    );
    const daysByStudent = new Map<string, Set<string>>();
    for (const e of checkinsByGrade) {
      const s = daysByStudent.get(e.studentId) ?? new Set<string>();
      s.add(e.date);
      daysByStudent.set(e.studentId, s);
    }
    const totalDays = [...daysByStudent.values()].reduce((sum, s) => sum + s.size, 0);
    const avgAttendanceDays =
      gradeStudents.length > 0 ? Math.round(totalDays / gradeStudents.length) : 0;

    return { grade, totalStudents: gradeStudents.length, presentToday, avgAttendanceDays };
  });
}
