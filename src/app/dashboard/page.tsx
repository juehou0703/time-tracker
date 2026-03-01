'use client'

import { useEffect, useMemo, useState } from 'react'
import { PieCard } from '@/components/PieCard'
import { TrendCard } from '@/components/TrendCard'
import { Card, CardBody, CardHeader, Select } from '@/components/ui'

type Summary = {
  period: string
  totalMs: number
  categories: { name: string; ms: number; pct: number }[]
  activities: { name: string; ms: number; pct: number }[]
}

type Trends = {
  categories: string[]
  points: Record<string, number | string>[]
}

function fmtHours(ms: number) {
  const h = ms / (1000 * 60 * 60)
  if (h < 1) return `${Math.round((h * 60) / 5) * 5}m`
  return `${h.toFixed(1)}h`
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'quarter'>('week')
  const [data, setData] = useState<Summary | null>(null)
  const [trends, setTrends] = useState<Trends | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setErr(null)

      const res = await fetch(`/api/analytics/summary?period=${period}`, {
        headers: { 'x-api-key': 'hello' },
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErr(json?.error || 'Failed to load')
        setData(null)
        setTrends(null)
        return
      }
      setData(json)

      const tRes = await fetch('/api/analytics/trends?days=30', { headers: { 'x-api-key': 'hello' } })
      const tJson = await tRes.json().catch(() => ({}))
      if (tRes.ok) setTrends({ categories: tJson.categories || [], points: tJson.points || [] })
    }
    run()
  }, [period])

  const topCategory = useMemo(() => (data?.categories?.[0] ? data.categories[0] : null), [data])
  const topActivity = useMemo(() => (data?.activities?.[0] ? data.activities[0] : null), [data])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-white/60">Breakdown + trends (v0).</p>
        </div>
        <Select value={period} onChange={(v) => setPeriod(v as 'day' | 'week' | 'month' | 'quarter')}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
        </Select>
      </div>

      {err && (
        <div className="rounded-[var(--radius)] border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
          {err}
        </div>
      )}

      {!data && !err && <div className="text-sm text-white/60">Loading…</div>}

      {data && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader title="Total tracked" subtitle={`${period}`} />
            <CardBody>
              <div className="text-3xl font-semibold tracking-tight">{fmtHours(data.totalMs)}</div>
              <div className="mt-2 text-xs text-white/50">Sum of entry durations in this period.</div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Top category" subtitle={topCategory?.name || '—'} />
            <CardBody>
              <div className="text-3xl font-semibold tracking-tight">{topCategory ? `${topCategory.pct.toFixed(1)}%` : '—'}</div>
              <div className="mt-2 text-xs text-white/50">Largest share of your tracked time.</div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Top activity" subtitle={topActivity?.name || '—'} />
            <CardBody>
              <div className="text-3xl font-semibold tracking-tight">{topActivity ? `${topActivity.pct.toFixed(1)}%` : '—'}</div>
              <div className="mt-2 text-xs text-white/50">Most frequent time sink. (Congrats?)</div>
            </CardBody>
          </Card>

          <div className="lg:col-span-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            <PieCard
              title={`By category (${period})`}
              data={data.categories.map((c) => ({ name: c.name, pct: c.pct }))}
            />
            <PieCard
              title={`By activity (${period})`}
              data={data.activities.map((a) => ({ name: a.name, pct: a.pct }))}
            />
          </div>

          {trends && trends.points.length > 0 && (
            <div className="lg:col-span-3">
              <TrendCard title="30-day trend (by category)" series={trends.categories} points={trends.points} />
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-white/45">
        Note: v0 assumes entries don’t overlap and attributes trends to the start day.
      </div>
    </div>
  )
}
