import { NextRequest, NextResponse } from 'next/server'

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Time Tracker"',
    },
  })
}

export function middleware(req: NextRequest) {
  const password = process.env.ADMIN_API_KEY
  if (!password) return NextResponse.next()

  // Let the WhatsApp webhook use x-api-key auth instead of browser basic auth.
  if (req.nextUrl.pathname.startsWith('/api/whatsapp/webhook')) {
    return NextResponse.next()
  }

  const auth = req.headers.get('authorization')
  if (!auth || !auth.toLowerCase().startsWith('basic ')) return unauthorized()

  try {
    const b64 = auth.slice(6)
    const [user, pass] = Buffer.from(b64, 'base64').toString('utf8').split(':')
    if (user !== 'judy' || pass !== password) return unauthorized()
    return NextResponse.next()
  } catch {
    return unauthorized()
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
