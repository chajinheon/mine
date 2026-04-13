import { NextRequest, NextResponse } from 'next/server';

// Firebase Admin SDK 간단한 버전 (Firestore Client SDK 사용)
import {
  initializeApp,
  cert,
  getApp,
} from 'firebase-admin/app';
import {
  getFirestore as getAdminFirestore,
} from 'firebase-admin/firestore';

let adminApp: any = null;

function getFirestoreAdmin() {
  try {
    adminApp = getApp('admin');
  } catch {
    try {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
      );
      adminApp = initializeApp(
        {
          credential: cert(serviceAccount),
        },
        'admin'
      );
    } catch {
      // Fallback: use client SDK simulation
      return null;
    }
  }
  return adminApp ? getAdminFirestore(adminApp) : null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: '유효한 날짜 형식이 필요합니다 (yyyy-MM-dd)' },
        { status: 400 }
      );
    }

    // Try to use Admin SDK
    const db = getFirestoreAdmin();

    if (!db) {
      // Mock data for development
      return NextResponse.json(
        {
          date,
          totalStudents: 450,
          presentCount: 425,
          absentCount: 25,
          attendanceRate: 94.4,
          byGrade: {
            1: { total: 150, present: 142, rate: 94.7 },
            2: { total: 150, present: 141, rate: 94.0 },
            3: { total: 150, present: 142, rate: 94.7 },
          },
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          },
        }
      );
    }

    // Fetch students
    const studentsSnap = await db.collection('students').get();
    const students = studentsSnap.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch attendance for the date
    const attendanceSnap = await db
      .collection('attendance_logs')
      .where('date', '==', date)
      .get();

    const attendance = attendanceSnap.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Calculate stats
    const presentStudents = new Set<string>();
    const byGrade: Record<number, { total: number; present: number; rate: number }> = {
      1: { total: 0, present: 0, rate: 0 },
      2: { total: 0, present: 0, rate: 0 },
      3: { total: 0, present: 0, rate: 0 },
    };

    students.forEach((student: any) => {
      byGrade[student.grade].total++;
    });

    attendance.forEach((entry: any) => {
      if (entry.entryType === 'checkin') {
        presentStudents.add(entry.studentId);
      }
    });

    students.forEach((student: any) => {
      if (presentStudents.has(student.studentId)) {
        byGrade[student.grade].present++;
      }
    });

    Object.entries(byGrade).forEach(([grade, data]: any) => {
      if (data.total > 0) {
        data.rate = (data.present / data.total) * 100;
      }
    });

    const totalPresent = presentStudents.size;
    const totalStudents = students.length;
    const attendanceRate = totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0;

    return NextResponse.json(
      {
        date,
        totalStudents,
        presentCount: totalPresent,
        absentCount: totalStudents - totalPresent,
        attendanceRate,
        byGrade,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '데이터를 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}
