import type { GradeStats } from '@/lib/types';

interface Props {
  stats: GradeStats[];
  totalStudents: number;
}

const gradeColors = [
  { bar: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700' },
  { bar: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-700' },
  { bar: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-700' },
];

export default function GradeStatsRow({ stats }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((g, i) => {
        const rate = g.totalStudents > 0
          ? Math.round((g.presentToday / g.totalStudents) * 100)
          : 0;
        const c = gradeColors[i];
        return (
          <div key={g.grade} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.light} ${c.text}`}>
                {g.grade}학년
              </span>
              <span className="text-sm text-slate-400">{g.totalStudents}명</span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>오늘 출석</span>
                <span className="font-semibold text-slate-700">{g.presentToday}명 ({rate}%)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${c.bar} rounded-full transition-all duration-700`}
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
            <div className="text-xs text-slate-500">
              자료 60일 평균 출석: <span className="font-semibold text-slate-700">{g.avgAttendanceDays}일</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
