import { Users, UserCheck, UserX, DoorOpen, LogOut } from 'lucide-react';

interface Props {
  totalStudents: number;
  todayPresent: number;
  currentlyIn: number;
  todayAbsent: number;
  todayCheckout: number;
}

const cards = [
  {
    key: 'total',
    label: '전체 학생',
    color: 'blue',
    icon: Users,
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    key: 'present',
    label: '오늘 출석',
    color: 'emerald',
    icon: UserCheck,
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    key: 'in',
    label: '현재 입실 중',
    color: 'violet',
    icon: DoorOpen,
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    badge: 'bg-violet-100 text-violet-700',
  },
  {
    key: 'checkout',
    label: '퇴실 완료',
    color: 'amber',
    icon: LogOut,
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    key: 'absent',
    label: '미출석',
    color: 'red',
    icon: UserX,
    bg: 'bg-red-50',
    text: 'text-red-500',
    badge: 'bg-red-100 text-red-600',
  },
];

export default function OverviewCards({
  totalStudents, todayPresent, currentlyIn, todayAbsent, todayCheckout,
}: Props) {
  const values: Record<string, number> = {
    total: totalStudents,
    present: todayPresent,
    in: currentlyIn,
    checkout: todayCheckout,
    absent: todayAbsent,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map(({ key, label, icon: Icon, bg, text, badge }) => (
        <div key={key} className="card p-5">
          <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
            <Icon className={`w-5 h-5 ${text}`} />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-0.5">{values[key]}</div>
          <div className="text-sm text-slate-500">{label}</div>
          {key === 'present' && totalStudents > 0 && (
            <div className={`mt-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>
              {Math.round((todayPresent / totalStudents) * 100)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
