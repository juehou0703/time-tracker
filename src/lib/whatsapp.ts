type Parsed =
  | { kind: 'log'; minutes: number; activity: string; note?: string }
  | { kind: 'help' }
  | { kind: 'unknown' }

// Examples:
// "log past hour as workout"
// "log past 30m as dinner"
// "log 45m meeting"
export function parseWhatsAppCommand(text: string): Parsed {
  const t = text.trim().toLowerCase()
  if (!t) return { kind: 'unknown' }
  if (t === 'help' || t === 'commands' || t === '?') return { kind: 'help' }

  // log past hour as workout
  let m = t.match(/^log\s+past\s+(hour|\d+)\s*(h|hr|hrs|hour|hours|m|min|mins|minute|minutes)?\s+(?:as\s+)?(.+?)$/)
  if (m) {
    const qty = m[1]
    const unit = m[2] || 'hour'
    const rest = m[3].trim()
    const minutes = qty === 'hour' ? 60 : Number(qty) * (unit.startsWith('h') || unit.includes('hour') ? 60 : 1)
    if (!Number.isFinite(minutes) || minutes <= 0) return { kind: 'unknown' }
    return { kind: 'log', minutes, activity: rest }
  }

  // log 45m workout
  m = t.match(/^log\s+(\d+)\s*(m|min|mins|minute|minutes|h|hr|hrs|hour|hours)\s+(.+?)$/)
  if (m) {
    const qty = Number(m[1])
    const unit = m[2]
    const activity = m[3].trim()
    const minutes = unit.startsWith('h') || unit.includes('hour') ? qty * 60 : qty
    if (!Number.isFinite(minutes) || minutes <= 0) return { kind: 'unknown' }
    return { kind: 'log', minutes, activity }
  }

  return { kind: 'unknown' }
}
