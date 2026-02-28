'use client'

import { useState } from 'react'

export default function LogPage() {
  const [categoryName, setCategoryName] = useState('Projects')
  const [activityName, setActivityName] = useState('AI project')
  const [startAt, setStartAt] = useState(() => new Date(Date.now() - 60 * 60 * 1000).toISOString().slice(0, 16))
  const [endAt, setEndAt] = useState(() => new Date().toISOString().slice(0, 16))
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  const submit = async () => {
    setMsg(null)
    const res = await fetch('/api/time-entries', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        categoryName,
        activityName,
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        note,
        source: 'web',
      }),
    })
    const json = await res.json()
    if (!res.ok) {
      setMsg(json?.error || 'Failed')
    } else {
      setMsg('Logged.')
      setNote('')
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-8 space-y-6">
      <h1 className="text-2xl font-bold">Log time</h1>

      <div className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
        <label className="grid gap-1">
          <span className="text-sm text-zinc-300">Category</span>
          <input className="rounded-lg border border-white/15 bg-black/20 px-3 py-2" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-zinc-300">Activity</span>
          <input className="rounded-lg border border-white/15 bg-black/20 px-3 py-2" value={activityName} onChange={(e) => setActivityName(e.target.value)} />
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-zinc-300">Start</span>
            <input type="datetime-local" className="rounded-lg border border-white/15 bg-black/20 px-3 py-2" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-zinc-300">End</span>
            <input type="datetime-local" className="rounded-lg border border-white/15 bg-black/20 px-3 py-2" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
          </label>
        </div>
        <label className="grid gap-1">
          <span className="text-sm text-zinc-300">Note</span>
          <input className="rounded-lg border border-white/15 bg-black/20 px-3 py-2" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>

        <button onClick={submit} className="rounded-lg border border-white/15 px-4 py-2 hover:bg-white/5">
          Save
        </button>

        {msg && <div className="text-sm text-zinc-300">{msg}</div>}
      </div>

      <div className="text-sm text-zinc-400 space-y-1">
        <div>WhatsApp command examples:</div>
        <ul className="list-disc pl-5">
          <li><code>log past hour as workout</code></li>
          <li><code>log 30m dinner</code></li>
          <li><code>help</code></li>
        </ul>
      </div>
    </main>
  )
}
