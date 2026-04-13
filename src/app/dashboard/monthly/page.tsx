'use client';

export default function MonthlyPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">월간 통계</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-6">2026년 4월</h3>
        
        <div className="grid grid-cols-7 gap-2">
          {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 30 }).map((_, i) => {
            const rate = Math.floor(Math.random() * 30) + 70;
            return (
              <div
                key={i}
                className="aspect-square rounded-lg flex items-center justify-center text-sm font-semibold"
                style={{
                  backgroundColor: `rgba(59, 130, 246, ${rate / 100})`,
                  color: rate > 50 ? 'white' : 'black',
                }}
              >
                <div className="text-center">
                  <div>{i + 1}</div>
                  <div className="text-xs">{rate}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">근무일</p>
          <p className="text-3xl font-bold">22</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">평균 출석률</p>
          <p className="text-3xl font-bold">92.1%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-600 text-sm">월간 성장</p>
          <p className="text-3xl font-bold text-green-600">+2.3%</p>
        </div>
      </div>
    </div>
  );
}
