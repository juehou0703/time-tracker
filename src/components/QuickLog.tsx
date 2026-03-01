'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui'

export type QuickActivity = {
  id: string
  label: string
  categoryName: string
  activityName: string
  icon?: string // emoji or short label
  accent?: string // css color
  defaultMinutes: number
}

const PRESET_MINUTES = [15, 25, 45, 60, 90, 120]

function clampTo5(mins: number) {
  if (!Number.isFinite(mins)) return 5
  return Math.max(5, Math.round(mins / 5) * 5)
}

function fmt(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h <= 0) return `${mins}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function lsKey(id: string) {
  return `tt:lastDuration:${id}`
}

const OTHER_NAME_KEY = 'tt:otherActivityName'

export function QuickLog({ activities }: { activities: QuickActivity[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [minutes, setMinutes] = useState(25)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null)
  const [otherName, setOtherName] = useState('Other')

  useEffect(() => {
    const fromLs = typeof window !== 'undefined' ? window.localStorage.getItem(OTHER_NAME_KEY) : null
    if (fromLs && fromLs.trim()) setOtherName(fromLs.trim())
  }, [])

  const active = useMemo(() => activities.find((a) => a.id === openId) || null, [activities, openId])

  useEffect(() => {
    if (!active) return
    const fromLs = typeof window !== 'undefined' ? window.localStorage.getItem(lsKey(active.id)) : null
    const m = fromLs ? parseInt(fromLs, 10) : active.defaultMinutes
    setMinutes(clampTo5(Number.isFinite(m) ? m : active.defaultMinutes))
    setNote('')
  }, [active])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const log = async () => {
    if (!active) return
    if (active.id === 'other' && !otherName.trim()) {
      setToast('Pick a name for the activity.')
      return
    }
    setBusy(true)
    setToast(null)
    try {
      const end = new Date()
      const start = new Date(end.getTime() - minutes * 60 * 1000)

      const res = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': 'hello' },
        body: JSON.stringify({
          categoryName: active.categoryName,
          activityName: active.id === 'other' ? otherName : active.activityName,
          startAt: start.toISOString(),
          endAt: end.toISOString(),
          note: note.trim() ? note.trim() : null,
          source: 'web',
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Failed to log')

      setLastCreatedId(json?.entry?.id || null)
      window.localStorage.setItem(lsKey(active.id), String(minutes))
      setToast(`Logged ${active.id === 'other' ? otherName : active.label} — ${fmt(minutes)}`)
      if (active.id === 'other') window.localStorage.setItem(OTHER_NAME_KEY, otherName)
      setOpenId(null)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed'
      setToast(msg)
    } finally {
      setBusy(false)
    }
  }

  const undo = async () => {
    if (!lastCreatedId) return
    setBusy(true)
    try {
      const res = await fetch(`/api/time-entries/${lastCreatedId}`, {
        method: 'DELETE',
        headers: { 'x-api-key': 'hello' },
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Failed to undo')
      setToast('Undone.')
      setLastCreatedId(null)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to undo'
      setToast(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {activities.map((a) => {
          const label = a.id === 'other' ? otherName : a.label
          return (
            <button
              key={a.id}
              onClick={() => setOpenId(a.id)}
              className="group relative overflow-hidden rounded-2xl border border-white/12 bg-white/5 px-4 py-4 text-left transition hover:bg-white/8 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold tracking-tight">{label}</div>
                  <div className="mt-1 text-xs text-white/55">{a.categoryName}</div>
                </div>
                <div
                  className="h-9 w-9 rounded-2xl ring-1 ring-white/10 bg-black/20 grid place-items-center"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}
                >
                  {a.icon ? (
                    <div className="text-base leading-none" aria-hidden>
                      {a.icon}
                    </div>
                  ) : (
                    <div className="h-3 w-3 rounded-full" style={{ background: a.accent || 'var(--primary)' }} />
                  )}
                </div>
              </div>
              <div className="mt-3 text-xs text-white/55">default {fmt(a.defaultMinutes)}</div>
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl"
                style={{ background: a.accent || 'var(--primary)' }}
              />
            </button>
          )
        })}
      </div>

      {toast && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
          <div>{toast}</div>
          {lastCreatedId && (
            <button onClick={undo} className="text-sm font-semibold text-white hover:underline" disabled={busy}>
              Undo
            </button>
          )}
        </div>
      )}

      <DurationSheet
        open={!!active}
        title={active ? (active.id === 'other' ? otherName : active.label) : ''}
        accent={active?.accent}
        minutes={minutes}
        setMinutes={setMinutes}
        note={note}
        setNote={setNote}
        busy={busy}
        onClose={() => (busy ? null : setOpenId(null))}
        onLog={log}
        isOther={active?.id === 'other'}
        otherName={otherName}
        setOtherName={setOtherName}
      />

      <div className="text-xs text-white/45">
        Tip: the picker uses 5-minute increments and remembers the last duration per button.
      </div>
    </div>
  )
}

function DurationSheet({
  open,
  title,
  accent,
  minutes,
  setMinutes,
  note,
  setNote,
  busy,
  onClose,
  onLog,
  isOther,
  otherName,
  setOtherName,
}: {
  open: boolean
  title: string
  accent?: string
  minutes: number
  setMinutes: (n: number) => void
  note: string
  setNote: (v: string) => void
  busy: boolean
  onClose: () => void
  onLog: () => void
  isOther?: boolean
  otherName?: string
  setOtherName?: (v: string) => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const bump = (delta: number) => setMinutes(clampTo5(minutes + delta))

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        disabled={busy}
      />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-2xl">
        <div className="rounded-t-3xl border border-white/10 bg-[#0b0b0f] px-5 pb-6 pt-4 shadow-[0_-30px_80px_rgba(0,0,0,0.6)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold tracking-tight">{title}</div>
              <div className="mt-1 text-xs text-white/55">Choose a duration</div>
            </div>
            <div className="h-8 w-8 rounded-xl ring-1 ring-white/10 bg-white/5 grid place-items-center">
              <div className="h-3 w-3 rounded-full" style={{ background: accent || 'var(--primary)' }} />
            </div>
          </div>

          {isOther && (
            <div className="mt-4">
              <label className="grid gap-1">
                <div className="text-xs text-white/60">Activity name</div>
                <input
                  value={otherName || ''}
                  onChange={(e) => setOtherName?.(e.target.value)}
                  placeholder="Name this activity"
                  className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-4 focus:ring-white/10"
                />
              </label>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {PRESET_MINUTES.map((m) => (
              <button
                key={m}
                onClick={() => setMinutes(m)}
                className={`rounded-xl border px-3 py-2 text-sm transition active:scale-[0.99] ${
                  minutes === m
                    ? 'border-white/20 bg-white/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/8'
                }`}
              >
                {fmt(m)}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-baseline justify-between">
              <div className="text-xs text-white/60">Duration</div>
              <div className="text-2xl font-semibold tracking-tight">{fmt(minutes)}</div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              <StepButton onClick={() => bump(-15)} disabled={busy}>
                −15
              </StepButton>
              <StepButton onClick={() => bump(-5)} disabled={busy}>
                −5
              </StepButton>
              <StepButton onClick={() => bump(5)} disabled={busy}>
                +5
              </StepButton>
              <StepButton onClick={() => bump(15)} disabled={busy}>
                +15
              </StepButton>
            </div>
          </div>

          <div className="mt-4">
            <label className="grid gap-1">
              <div className="text-xs text-white/60">Note (optional)</div>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="what was this block for?"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-4 focus:ring-white/10"
              />
            </label>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <Button kind="default" onClick={onClose}>
              Cancel
            </Button>
            <Button kind="primary" onClick={onLog}>
              {busy ? 'Logging…' : 'Log'}
            </Button>
          </div>

          <div className="mt-3 text-xs text-white/45">Times are logged as ending now (start = now − duration).</div>
        </div>
      </div>
    </div>
  )
}

function StepButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-sm font-semibold text-white/85 hover:bg-black/35 transition disabled:opacity-50"
    >
      {children}
    </button>
  )
}
