import Link from 'next/link'
import { FeedbackBox } from '@/components/FeedbackBox'

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-[var(--radius)] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Track your time. Understand your life.</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/65">
              Log activities (web or WhatsApp), group them by category, and get clean analytics for day/week/month/quarter.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/log"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-white/10 bg-[color:var(--primary)] text-black hover:brightness-[0.95] transition"
            >
              Log time
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-white/15 bg-white/5 hover:bg-white/10 transition text-white"
            >
              View analytics
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-xs text-white/55">WhatsApp</div>
            <div className="mt-1 font-semibold">Log in 1 message</div>
            <div className="mt-2 text-xs text-white/55 font-mono">log past hour as workout</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-xs text-white/55">Categories</div>
            <div className="mt-1 font-semibold">Group activities</div>
            <div className="mt-2 text-xs text-white/55">Projects, Meetings, Health, Food…</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-xs text-white/55">Analytics</div>
            <div className="mt-1 font-semibold">See trends</div>
            <div className="mt-2 text-xs text-white/55">Percent breakdown + 30‑day chart</div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-[var(--radius)] border border-white/10 bg-white/5 p-6">
          <h2 className="text-sm font-semibold tracking-tight">API endpoints</h2>
          <div className="mt-3 space-y-2 text-xs text-white/60">
            <div>
              <span className="font-mono text-white/80">/api/time-entries</span> — create/list entries
            </div>
            <div>
              <span className="font-mono text-white/80">/api/analytics/summary</span> — breakdown
            </div>
            <div>
              <span className="font-mono text-white/80">/api/analytics/trends</span> — 30‑day trend
            </div>
          </div>
        </div>
        <div className="rounded-[var(--radius)] border border-white/10 bg-white/5 p-6">
          <h2 className="text-sm font-semibold tracking-tight">Security (v0)</h2>
          <p className="mt-3 text-xs text-white/60">
            API routes are protected by <span className="font-mono text-white/80">x-api-key</span> when
            <span className="font-mono text-white/80"> ADMIN_API_KEY</span> is set.
          </p>
        </div>
      </section>

      <FeedbackBox page="home" />
    </div>
  )
}
