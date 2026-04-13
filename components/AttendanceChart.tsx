'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { DailyAttendance } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface Props {
  data: DailyAttendance[];
}

interface TooltipEntry {
  value: number;
  name: string;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-semibold text-slate-800">{p.value}명</span>
        </div>
      ))}
    </div>
  );
}

export default function AttendanceChart({ data }: Props) {
  const last30 = data.slice(-30).map((d) => ({
    ...d,
    label: format(parseISO(d.date), 'M/d'),
  }));

  return (
    <div className="card p-6">
      <h2 className="text-base font-bold text-slate-800 mb-5">30일 출석 추이</h2>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={last30} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gCheckout" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v: string) => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>}
          />
          <Area
            type="monotone"
            dataKey="presentCount"
            name="입실"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#gPresent)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="checkoutCount"
            name="퇴실"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#gCheckout)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
