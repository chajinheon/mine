// Common types from attendance-app-final
export interface Student {
  id: string;
  studentId: string; // 5자리 학번 (예: 30228)
  name: string;
  grade: number; // 1, 2, 3
  classNum: number;
  number: number;
}

export interface AttendanceEntry {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: any; // Firebase Timestamp
  date: string; // yyyy-MM-dd
  grade: number;
  type: 'scan' | 'keypad';
  entryType?: 'checkin' | 'checkout';
  studyDuration?: string;
  autoCheckout?: boolean;
}

export interface BarcodeMapping {
  id: string;
  barcode: string;
  studentId: string;
}

export interface CardScan {
  id: string;
  rawCode: string;
  studentId: string;
  studentName: string;
  timestamp: any; // Firebase Timestamp
  date: string;
  monthKey: string; // yyyy-MM
  grade: number;
  point: number;
}

// Statistics types
export interface DailyStats {
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number; // 0-100
  byGrade: {
    [grade: number]: {
      total: number;
      present: number;
      rate: number;
    };
  };
}

export interface StudentStats {
  studentId: string;
  name: string;
  grade: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  attendanceRate: number;
  totalStudyMinutes: number;
  averageStudyMinutes: number;
  latestCheckIn?: string; // ISO string
}

export interface RankingEntry {
  rank: number;
  studentId: string;
  name: string;
  grade: number;
  value: number;
  unit: string;
}

export interface WeeklyStats {
  weekStart: string; // yyyy-MM-dd (Monday)
  weekEnd: string; // yyyy-MM-dd (Sunday)
  days: DailyStats[];
  averageRate: number;
}

export interface MonthlyStats {
  month: string; // yyyy-MM
  totalDays: number;
  workingDays: number;
  averageRate: number;
  byWeek: WeeklyStats[];
}
