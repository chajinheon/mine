import {
  collection,
  query,
  where,
  getDocs,
  Firestore,
} from 'firebase/firestore';
import { Student, AttendanceEntry } from '@/types';
import { format, parseISO } from 'date-fns';

export async function getAttendanceByDate(
  db: Firestore,
  date: string
): Promise<AttendanceEntry[]> {
  try {
    const q = query(
      collection(db, 'attendance_logs'),
      where('date', '==', date)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as AttendanceEntry));
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
}

export async function getAllStudents(db: Firestore): Promise<Student[]> {
  try {
    const snap = await getDocs(collection(db, 'students'));
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Student));
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

export async function getStudentById(
  db: Firestore,
  studentId: string
): Promise<Student | null> {
  try {
    const students = await getAllStudents(db);
    return students.find((s) => s.studentId === studentId) || null;
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
}

export async function getAttendanceRange(
  db: Firestore,
  startDate: string,
  endDate: string
): Promise<AttendanceEntry[]> {
  try {
    const q = query(
      collection(db, 'attendance_logs'),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as AttendanceEntry));
  } catch (error) {
    console.error('Error fetching attendance range:', error);
    return [];
  }
}

export async function getCardScans(
  db: Firestore,
  startDate: string,
  endDate: string
) {
  try {
    const q = query(
      collection(db, 'card_scans'),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching card scans:', error);
    return [];
  }
}
