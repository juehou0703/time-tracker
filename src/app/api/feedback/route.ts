import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireApiKey } from '@/lib/auth'

const PostSchema = z.object({
  page: z.string().min(1).max(64),
  message: z.string().min(1).max(2000),
  source: z.string().min(1).max(32).optional(),
})

export async function POST(req: NextRequest) {
  // Public (web UI is protected by basic auth middleware). We intentionally do NOT require x-api-key here.
  const body = await req.json().catch(() => null)
  const parsed = PostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const fb = await prisma.feedback.create({
    data: {
      page: parsed.data.page,
      message: parsed.data.message,
      source: parsed.data.source || 'web',
    },
  })

  return NextResponse.json({ feedback: fb })
}

export async function GET(req: NextRequest) {
  // Admin-only: Judy will poll this hourly.
  const auth = requireApiKey(req)
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const since = req.nextUrl.searchParams.get('since')
  const page = req.nextUrl.searchParams.get('page')
  const take = Math.min(200, Math.max(1, Number(req.nextUrl.searchParams.get('take') || 50)))

  const where: Prisma.FeedbackWhereInput = {}
  if (since) where.createdAt = { gt: new Date(since) }
  if (page) where.page = page

  const feedback = await prisma.feedback.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take,
  })

  return NextResponse.json({ feedback })
}
