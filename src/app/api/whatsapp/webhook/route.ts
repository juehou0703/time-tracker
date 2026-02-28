import { NextRequest, NextResponse } from 'next/server'
import { requireApiKey } from '@/lib/auth'
import { parseWhatsAppCommand } from '@/lib/whatsapp'
import { prisma } from '@/lib/db'

// Supports two modes:
// 1) Simple JSON: { "text": "log past hour as workout", "from": "+1..." }
// 2) WhatsApp Cloud API style payloads (best-effort; you can adapt later)

export async function GET(req: NextRequest) {
  // Verification hook for WhatsApp Cloud API (optional)
  const mode = req.nextUrl.searchParams.get('hub.mode')
  const token = req.nextUrl.searchParams.get('hub.verify_token')
  const challenge = req.nextUrl.searchParams.get('hub.challenge')
  if (mode === 'subscribe' && token && challenge && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge)
  }
  return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest) {
  const auth = requireApiKey(req)
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const body = await req.json().catch(() => ({}))

  const text: string | undefined =
    body?.text ||
    body?.messages?.[0]?.text?.body ||
    body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body

  if (!text) return NextResponse.json({ ok: true, ignored: true })

  const parsed = parseWhatsAppCommand(String(text))

  if (parsed.kind === 'help') {
    return NextResponse.json({ ok: true, reply: 'Commands:\n- log past hour as workout\n- log 30m dinner\n- log 2h meetings' })
  }

  if (parsed.kind !== 'log') {
    return NextResponse.json({ ok: true, reply: "Sorry, I didn't understand. Send 'help' for commands." })
  }

  const endAt = new Date()
  const startAt = new Date(endAt.getTime() - parsed.minutes * 60_000)

  // Default category mapping (v0). You can customize later.
  const activityRaw = parsed.activity.trim()
  const lower = activityRaw.toLowerCase()
  const categoryName =
    lower.includes('workout') || lower.includes('gym') ? 'Health' :
    lower.includes('meeting') ? 'Meetings' :
    lower.includes('lunch') || lower.includes('dinner') || lower.includes('breakfast') ? 'Food' :
    lower.includes('relationship') ? 'Relationships' :
    lower.includes('ai') || lower.includes('project') ? 'Projects' :
    'General'

  const category = await prisma.category.upsert({
    where: { name: categoryName },
    update: {},
    create: { name: categoryName },
  })

  const activity = await prisma.activity.upsert({
    where: { name_categoryId: { name: activityRaw, categoryId: category.id } },
    update: {},
    create: { name: activityRaw, categoryId: category.id },
  })

  const entry = await prisma.timeEntry.create({
    data: { startAt, endAt, source: 'whatsapp', activityId: activity.id },
  })

  return NextResponse.json({ ok: true, entryId: entry.id, reply: `Logged ${parsed.minutes}m as ${activityRaw} (${categoryName}).` })
}
