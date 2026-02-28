'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#5eead4', '#60a5fa', '#c084fc', '#fb7185', '#fbbf24', '#34d399', '#a1a1aa']

export function TrendCard({
  title,
  series,
  points,
}: {
  title: string
  series: string[]
  points: Record<string, number | string>[]
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:col-span-2">
      <div className="font-semibold mb-3">{title}</div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ left: 6, right: 10, top: 10, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} unit="m" />
            <Tooltip />
            <Legend />
            {series.slice(0, 6).map((s, i) => (
              <Line
                key={s}
                type="monotone"
                dataKey={s}
                stroke={COLORS[i % COLORS.length]}
                dot={false}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-zinc-400">Minutes per day (v0: entries attributed to start day).</div>
    </div>
  )
}
