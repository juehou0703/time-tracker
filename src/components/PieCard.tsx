'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#5eead4', '#60a5fa', '#c084fc', '#fb7185', '#fbbf24', '#34d399', '#a1a1aa']

export function PieCard({ title, data }: { title: string; data: { name: string; pct: number }[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="font-semibold mb-3">{title}</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="pct" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number | string) => `${Number(v).toFixed(1)}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-zinc-300">
        {data.slice(0, 8).map((d) => (
          <div key={d.name} className="flex justify-between">
            <span className="truncate pr-3">{d.name}</span>
            <span>{d.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
