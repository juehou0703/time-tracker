'use client'

import { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Input } from '@/components/ui'

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
      headers: { 'content-type': 'application/json', 'x-api-key': 'hello' },
      body: JSON.stringify({
        categoryName,
        activityName,
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        note,
        source: 'web',
      }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMsg(json?.error || 'Failed')
    } else {
      setMsg('Logged.')
      setNote('')
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader title="Log time" subtitle="Create a time entry (web). WhatsApp logging is even faster." />
          <CardBody>
            <div className="grid gap-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-xs text-white/60">Category</div>
                  <Input value={categoryName} onChange={setCategoryName} placeholder="e.g. Meetings" />
                </label>
                <label className="grid gap-1">
                  <div className="text-xs text-white/60">Activity</div>
                  <Input value={activityName} onChange={setActivityName} placeholder="e.g. 1:1" />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="grid gap-1">
                  <div className="text-xs text-white/60">Start</div>
                  <Input value={startAt} onChange={setStartAt} type="datetime-local" />
                </label>
                <label className="grid gap-1">
                  <div className="text-xs text-white/60">End</div>
                  <Input value={endAt} onChange={setEndAt} type="datetime-local" />
                </label>
              </div>

              <label className="grid gap-1">
                <div className="text-xs text-white/60">Note (optional)</div>
                <Input value={note} onChange={setNote} placeholder="what was this block for?" />
              </label>

              <div className="flex items-center gap-3">
                <Button kind="primary" onClick={submit}>
                  Save
                </Button>
                {msg && <div className="text-sm text-white/70">{msg}</div>}
              </div>

              <div className="mt-2 text-xs text-white/45">
                (v0) This page currently uses a fixed api key <span className="font-mono">hello</span>. We’ll
                swap that for a server-side proxy once the Judy WhatsApp bridge is wired.
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader title="WhatsApp commands" subtitle="Message Judy (this WhatsApp) to log quickly." />
          <CardBody>
            <div className="space-y-3 text-sm text-white/75">
              <Cmd>log past hour as workout</Cmd>
              <Cmd>log 30m dinner</Cmd>
              <Cmd>log 2h meetings</Cmd>
              <Cmd>help</Cmd>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

function Cmd({ children }: { children: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-xs text-white/80">
      {children}
    </div>
  )
}
