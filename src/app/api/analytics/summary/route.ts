import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireApiKey } from '@/lib/auth'
import { DEFAULT_TZ, startOfPeriodInTimeZone } from '@/lib/time'

export async function GET(req: NextRequest) {
  const auth = requireApiKey(req)
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const period = (req.nextUrl.searchParams.get('period') || 'week') as 'day' | 'week' | 'month' | 'quarter'
  const now = new Date()
  const start = startOfPeriodInTimeZone(now, period, DEFAULT_TZ)

  const entries = await prisma.timeEntry.findMany({
    where: { endAt: { gte: start }, startAt: { lte: now } },
    include: { activity: { include: { category: true } } },
  })

  // naive duration calc (assumes no overlaps; ok for v0)
  const byCategory = new Map<string, number>()
  const byActivity = new Map<string, number>()
  let totalMs = 0

  for (const e of entries) {
    const ms = Math.max(0, new Date(e.endAt).getTime() - new Date(e.startAt).getTime())
    totalMs += ms
    const cat = e.activity.category.name
    const act = `${cat} / ${e.activity.name}`
    byCategory.set(cat, (byCategory.get(cat) || 0) + ms)
    byActivity.set(act, (byActivity.get(act) || 0) + ms)
  }

  const toPct = (ms: number) => (totalMs ? (ms / totalMs) * 100 : 0)

  const categories = [...byCategory.entries()]
    .map(([name, ms]) => ({ name, ms, pct: toPct(ms) }))
    .sort((a, b) => b.ms - a.ms)

  const activities = [...byActivity.entries()]
    .map(([name, ms]) => ({ name, ms, pct: toPct(ms) }))
    .sort((a, b) => b.ms - a.ms)

  return NextResponse.json({ period, start, end: now, totalMs, categories, activities })
}
