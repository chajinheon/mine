import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Firestore,
} from 'firebase/firestore';
import type { Student, AttendanceEntry, CardScan } from './types';

export async function fetchAllStudents(db: Firestore): Promise<Student[]> {
  const snap = await getDocs(collection(db, 'students'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Student));
}

export async function fetchAttendanceByDate(
  db: Firestore,
  date: string
): Promise<AttendanceEntry[]> {
  const q = query(
    collection(db, 'attendance_logs'),
    where('date', '==', date)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AttendanceEntry));
}

export async function fetchAttendanceByDateRange(
  db: Firestore,
  fromDate: string,
  toDate: string
): Promise<AttendanceEntry[]> {
  const q = query(
    collection(db, 'attendance_logs'),
    where('date', '>=', fromDate),
    where('date', '<=', toDate),
    orderBy('date', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AttendanceEntry));
}

export async function fetchCardScansByMonth(
  db: Firestore,
  monthKey: string
): Promise<CardScan[]> {
  const q = query(
    collection(db, 'card_scans'),
    where('monthKey', '==', monthKey)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CardScan));
}

export async function fetchRecentAttendance(
  db: Firestore,
  days = 30
): Promise<AttendanceEntry[]> {
  const from = new Date();
  from.setDate(from.getDate() - days);
  const fromStr = from.toISOString().slice(0, 10);
  const toStr = new Date().toISOString().slice(0, 10);
  return fetchAttendanceByDateRange(db, fromStr, toStr);
}
