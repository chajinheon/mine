import type { Timestamp } from 'firebase/firestore';

export interface Student {
  id: string;
  studentId: string;
  name: string;
  grade: number;
  classNum: number;
  number: number;
}

export interface AttendanceEntry {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: Timestamp;
  date: string;
  grade: number;
  type: 'scan' | 'keypad';
  entryType?: 'checkin' | 'checkout';
  studyDuration?: string;
  autoCheckout?: boolean;
}

export interface CardScan {
  id: string;
  rawCode: string;
  studentId: string;
  studentName: string;
  timestamp: Timestamp;
  date: string;
  monthKey: string;
  grade: number;
  point: number;
}

export interface StudentStats {
  student: Student;
  totalDays: number;         // 총 출석 일수
  totalStudyMinutes: number; // 총 공부 시간(분)
  avgStudyMinutes: number;   // 평균 공부 시간(분)
  lastAttendance: string | null; // 마지막 출석일
  thisMonthDays: number;     // 이번달 출석 일수
  checkinTimes: string[];    // 입실 시각 목록
}

export interface DailyAttendance {
  date: string;
  presentCount: number;
  checkinCount: number;
  checkoutCount: number;
}

export interface GradeStats {
  grade: number;
  totalStudents: number;
  presentToday: number;
  avgAttendanceDays: number;
}
