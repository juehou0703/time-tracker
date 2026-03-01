'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui'

export function FeedbackBox({ page }: { page: string }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const submit = async () => {
    const msg = text.trim()
    if (!msg) return

    setBusy(true)
    setToast(null)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ page, message: msg, source: 'web' }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Failed to submit')

      setText('')
      setToast('Thanks — feedback saved.')
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : 'Failed'
      setToast(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-[var(--radius)] border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold tracking-tight">Feedback</div>
          <div className="mt-1 text-xs text-white/60">
            Tell us what’s confusing, what’s missing, or what you want faster.
          </div>
        </div>
        <div className="text-xs text-white/45">{page}</div>
      </div>

      <div className="mt-3 grid gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type feedback here…"
          className="min-h-[92px] w-full resize-y rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-4 focus:ring-white/10"
        />
        <div className="flex items-center justify-between gap-3">
          {toast ? <div className="text-xs text-white/60">{toast}</div> : <div />}
          <Button kind="primary" onClick={submit} disabled={busy || !text.trim()}>
            {busy ? 'Sending…' : 'Send feedback'}
          </Button>
        </div>
      </div>
    </div>
  )
}
