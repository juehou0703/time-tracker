import { NextRequest } from 'next/server'

export function requireApiKey(req: NextRequest) {
  const expected = process.env.ADMIN_API_KEY
  if (!expected) return { ok: true as const }

  const got = req.headers.get('x-api-key') || req.nextUrl.searchParams.get('key')
  if (got && got === expected) return { ok: true as const }
  return { ok: false as const, status: 401, message: 'Unauthorized' }
}
