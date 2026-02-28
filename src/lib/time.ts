export function clampDateRange(start: Date, end: Date) {
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) throw new Error('Invalid date')
  if (end <= start) throw new Error('end must be after start')
  return { start, end }
}

export function msToHours(ms: number) {
  return ms / (1000 * 60 * 60)
}

export function startOfPeriod(now: Date, period: 'day' | 'week' | 'month' | 'quarter') {
  const d = new Date(now)
  if (period === 'day') {
    d.setHours(0, 0, 0, 0)
    return d
  }
  if (period === 'week') {
    // Monday-start week
    const day = (d.getDay() + 6) % 7
    d.setDate(d.getDate() - day)
    d.setHours(0, 0, 0, 0)
    return d
  }
  if (period === 'month') {
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
  }
  // quarter
  const q = Math.floor(d.getMonth() / 3)
  d.setMonth(q * 3, 1)
  d.setHours(0, 0, 0, 0)
  return d
}
