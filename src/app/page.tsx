import Link from 'next/link'

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8 space-y-6">
      <h1 className="text-3xl font-bold">Time Tracker</h1>
      <p className="text-zinc-300">
        Personal time tracking with analytics + WhatsApp logging (backend endpoint included).
      </p>
      <div className="flex gap-3">
        <Link className="rounded-lg border border-white/15 px-4 py-2 hover:bg-white/5" href="/dashboard">
          Dashboard
        </Link>
        <Link className="rounded-lg border border-white/15 px-4 py-2 hover:bg-white/5" href="/log">
          Log time
        </Link>
      </div>
      <div className="text-sm text-zinc-400 space-y-1">
        <div>API: <code className="px-2 py-1 rounded bg-white/5">/api/time-entries</code></div>
        <div>Analytics: <code className="px-2 py-1 rounded bg-white/5">/api/analytics/summary?period=week</code></div>
        <div>WhatsApp webhook: <code className="px-2 py-1 rounded bg-white/5">/api/whatsapp/webhook</code></div>
      </div>
    </main>
  )
}
