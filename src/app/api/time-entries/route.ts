import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { requireApiKey } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = requireApiKey(req)
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const start = req.nextUrl.searchParams.get('start')
  const end = req.nextUrl.searchParams.get('end')

  const where: Prisma.TimeEntryWhereInput = {}
  if (start) where.endAt = { gte: new Date(start) }
  if (end) where.startAt = { lte: new Date(end) }

  const entries = await prisma.timeEntry.findMany({
    where,
    orderBy: { startAt: 'desc' },
    include: { activity: { include: { category: true } } },
    take: 500,
  })

  return NextResponse.json({ entries })
}

export async function POST(req: NextRequest) {
  const auth = requireApiKey(req)
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const body = await req.json()
  const { startAt, endAt, activityName, categoryName, note, source } = body || {}

  if (!startAt || !endAt || !activityName || !categoryName) {
    return NextResponse.json({ error: 'startAt, endAt, activityName, categoryName required' }, { status: 400 })
  }

  const start = new Date(startAt)
  const end = new Date(endAt)
  if (!(start instanceof Date) || Number.isNaN(start.getTime())) return NextResponse.json({ error: 'Invalid startAt' }, { status: 400 })
  if (!(end instanceof Date) || Number.isNaN(end.getTime())) return NextResponse.json({ error: 'Invalid endAt' }, { status: 400 })
  if (end <= start) return NextResponse.json({ error: 'endAt must be after startAt' }, { status: 400 })

  const category = await prisma.category.upsert({
    where: { name: String(categoryName) },
    update: {},
    create: { name: String(categoryName) },
  })

  const activity = await prisma.activity.upsert({
    where: {
      name_categoryId: {
        name: String(activityName),
        categoryId: category.id,
      },
    },
    update: {},
    create: { name: String(activityName), categoryId: category.id },
  })

  const entry = await prisma.timeEntry.create({
    data: {
      startAt: start,
      endAt: end,
      note: note ? String(note) : null,
      source: source ? String(source) : 'web',
      activityId: activity.id,
    },
    include: { activity: { include: { category: true } } },
  })

  return NextResponse.json({ entry })
}
