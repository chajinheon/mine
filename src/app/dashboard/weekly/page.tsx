'use client';

export default function WeeklyPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">주간 통계</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { day: '월', rate: 94.2 },
          { day: '화', rate: 93.8 },
          { day: '수', rate: 94.5 },
          { day: '목', rate: 92.1 },
          { day: '금', rate: 91.5 },
        ].map((data) => (
          <div key={data.day} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">{data.day}요일</h3>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-blue-600">{data.rate.toFixed(1)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${data.rate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">주간 평균</h3>
        <p className="text-5xl font-bold text-blue-600">93.2%</p>
      </div>
    </div>
  );
}
