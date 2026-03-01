import Link from 'next/link'

const nav = [
  { href: '/', label: 'Home' },
  { href: '/log', label: 'Log' },
  { href: '/dashboard', label: 'Analytics' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <Link href="/" className="group flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-white/5 ring-1 ring-white/15 grid place-items-center shadow-sm">
              <div className="h-3 w-3 rounded-full" style={{ background: 'var(--primary)' }} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Time Tracker</div>
              <div className="text-xs text-white/55">personal analytics</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-xl px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="text-xs text-white/55">v0</div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>

      <footer className="mx-auto max-w-5xl px-5 pb-10 pt-2 text-xs text-white/45">
        Data stored in Postgres (Neon). WhatsApp logging via Judy bridge.
      </footer>
    </div>
  )
}
