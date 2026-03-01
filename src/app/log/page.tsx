'use client'

import { Card, CardBody, CardHeader } from '@/components/ui'
import { QuickLog, type QuickActivity } from '@/components/QuickLog'
import { FeedbackBox } from '@/components/FeedbackBox'

const quick: QuickActivity[] = [
  {
    id: 'workout',
    label: 'Workout',
    categoryName: 'Health',
    activityName: 'Workout',
    icon: '🏋️',
    accent: '#ff7a18',
    defaultMinutes: 60,
  },
  {
    id: 'build-ai',
    label: 'Build w/ AI',
    categoryName: 'Projects',
    activityName: 'Building with AI',
    icon: '🤖',
    accent: '#7c5cff',
    defaultMinutes: 45,
  },
  {
    id: 'meetings',
    label: 'Meetings',
    categoryName: 'Meetings',
    activityName: 'Meetings',
    icon: '📞',
    accent: '#22c55e',
    defaultMinutes: 30,
  },
  {
    id: 'coding',
    label: 'Coding',
    categoryName: 'Projects',
    activityName: 'Coding',
    icon: '💻',
    accent: '#06b6d4',
    defaultMinutes: 25,
  },
  {
    id: 'deep-work',
    label: 'Deep Work',
    categoryName: 'Projects',
    activityName: 'Deep Work',
    icon: '🧠',
    accent: '#f97316',
    defaultMinutes: 45,
  },
  {
    id: 'admin',
    label: 'Admin',
    categoryName: 'Ops',
    activityName: 'Admin',
    icon: '🧾',
    accent: '#94a3b8',
    defaultMinutes: 15,
  },
  {
    id: 'other',
    label: 'Other',
    categoryName: 'Misc',
    activityName: 'Other',
    icon: '✏️',
    accent: '#a78bfa',
    defaultMinutes: 25,
  },
]

export default function LogPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader title="Quick Log" subtitle="Tap a button → pick duration → log. (5-minute increments)" />
            <CardBody>
              <QuickLog activities={quick} />
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

      <FeedbackBox page="log" />
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
