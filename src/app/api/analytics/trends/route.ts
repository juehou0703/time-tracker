import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireApiKey } from '@/lib/auth'

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export async function GET(req: NextRequest) {
  const auth = requireApiKey(req)
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const days = Math.min(365, Math.max(7, Number(req.nextUrl.searchParams.get('days') || 30)))
  const end = new Date()
  const start = new Date(end.getTime() - (days - 1) * 24 * 60 * 60 * 1000)
  start.setHours(0, 0, 0, 0)

  const entries = await prisma.timeEntry.findMany({
    where: { endAt: { gte: start }, startAt: { lte: end } },
    include: { activity: { include: { category: true } } },
  })

  // Build day buckets for categories
  const categories = new Set<string>()
  const byDay: Record<string, Record<string, number>> = {}

  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
    byDay[toISODate(d)] = {}
  }

  for (const e of entries) {
    const cat = e.activity.category.name
    categories.add(cat)

    // attribute entry to the day of its start (v0 simplification)
    const day = toISODate(new Date(e.startAt))
    if (!byDay[day]) continue
    const ms = Math.max(0, new Date(e.endAt).getTime() - new Date(e.startAt).getTime())
    byDay[day][cat] = (byDay[day][cat] || 0) + ms
  }

  const categoryList = [...categories.values()].sort()

  const points = Object.keys(byDay)
    .sort()
    .map((date) => {
      const row: Record<string, number | string> = { date }
      for (const cat of categoryList) row[cat] = Math.round(((byDay[date][cat] || 0) / (1000 * 60)) * 10) / 10 // minutes
      return row
    })

  return NextResponse.json({ start, end, days, categories: categoryList, points })
}
