'use client'

import { useEffect, useState } from 'react'
import { PieCard } from '@/components/PieCard'

type Summary = {
  period: string
  totalMs: number
  categories: { name: string; ms: number; pct: number }[]
  activities: { name: string; ms: number; pct: number }[]
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'quarter'>('week')
  const [data, setData] = useState<Summary | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setErr(null)
      const res = await fetch(`/api/analytics/summary?period=${period}`)
      const json = await res.json()
      if (!res.ok) {
        setErr(json?.error || 'Failed to load')
        setData(null)
        return
      }
      setData(json)
    }
    run()
  }, [period])

  return (
    <main className="mx-auto max-w-5xl p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <select
          className="rounded-lg border border-white/15 bg-black/20 px-3 py-2"
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'day' | 'week' | 'month' | 'quarter')}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
        </select>
      </div>

      {err && <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-red-200">{err}</div>}
      {!data && !err && <div className="text-zinc-400">Loading…</div>}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PieCard
            title={`By category (${period})`}
            data={data.categories.map((c) => ({ name: c.name, pct: c.pct }))}
          />
          <PieCard
            title={`By activity (${period})`}
            data={data.activities.map((a) => ({ name: a.name, pct: a.pct }))}
          />
        </div>
      )}

      <p className="text-sm text-zinc-400">
        v0 uses a simple duration sum and assumes entries don’t overlap. We can add overlap handling + trend charts next.
      </p>
    </main>
  )
}
