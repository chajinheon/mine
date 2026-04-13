'use client';

export default function GradesPage() {
  const grades = [
    { grade: 1, attendance: 94.2, students: 150, present: 141 },
    { grade: 2, attendance: 93.1, students: 150, present: 140 },
    { grade: 3, attendance: 91.8, students: 150, present: 138 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">학년별 비교</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {grades.map((data) => (
          <div key={data.grade} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-2xl font-bold mb-4">{data.grade}학년</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm mb-1">출석률</p>
                <p className="text-4xl font-bold text-blue-600">{data.attendance.toFixed(1)}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${data.attendance}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 pt-2">
                {data.present}명 / {data.students}명
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">학년별 평균 공부시간</h3>
        <div className="space-y-4">
          {grades.map((data) => (
            <div key={data.grade} className="flex items-center justify-between">
              <span className="font-medium">{data.grade}학년</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4 mx-4 overflow-hidden">
                <div
                  className="bg-green-600 h-full"
                  style={{ width: `${data.attendance}%` }}
                />
              </div>
              <span className="w-20 text-right">2h {Math.floor(Math.random() * 60)}m</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
