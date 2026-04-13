import { NextRequest, NextResponse } from 'next/server';

/**
 * Daily Statistics API
 * Returns attendance statistics for a specific date
 *
 * Query Params:
 * - date: yyyy-MM-dd (required)
 *
 * Demo Mode: Returns mock data until Firebase Admin SDK is configured
 */

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

    // Mock data - 실제 Firebase 연결 시 교체
    const mockData = {
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
    };

    return NextResponse.json(mockData, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '데이터를 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}
