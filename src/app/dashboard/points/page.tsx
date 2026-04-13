'use client';

export default function PointsPage() {
  const topStudents = [
    { name: '김철수', points: 450, scans: 45 },
    { name: '이영희', points: 420, scans: 42 },
    { name: '박민준', points: 380, scans: 38 },
    { name: '최은지', points: 360, scans: 36 },
    { name: '정수현', points: 340, scans: 34 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">카드 스캔 포인트</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-6">상위 학생</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left">순위</th>
                <th className="px-4 py-3 text-left">이름</th>
                <th className="px-4 py-3 text-right">포인트</th>
                <th className="px-4 py-3 text-right">스캔 횟수</th>
              </tr>
            </thead>
            <tbody>
              {topStudents.map((student, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="inline-block w-8 h-8 rounded-full bg-yellow-500 text-white text-center leading-8 font-bold">
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-600">{student.points}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{student.scans}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
