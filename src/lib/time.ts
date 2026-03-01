export function clampDateRange(start: Date, end: Date) {
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) throw new Error('Invalid date')
  if (end <= start) throw new Error('end must be after start')
  return { start, end }
}

export function msToHours(ms: number) {
  return ms / (1000 * 60 * 60)
}

import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'

export const DEFAULT_TZ = 'America/Los_Angeles'

export function startOfPeriod(now: Date, period: 'day' | 'week' | 'month' | 'quarter') {
  // Back-compat: uses runtime timezone (UTC on Vercel). Prefer startOfPeriodInTimeZone.
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

export function isoDateInTimeZone(d: Date, timeZone = DEFAULT_TZ) {
  return formatInTimeZone(d, timeZone, 'yyyy-MM-dd')
}

export function startOfDayInTimeZone(now: Date, timeZone = DEFAULT_TZ) {
  const zoned = toZonedTime(now, timeZone)
  zoned.setHours(0, 0, 0, 0)
  return fromZonedTime(zoned, timeZone)
}

export function startOfPeriodInTimeZone(now: Date, period: 'day' | 'week' | 'month' | 'quarter', timeZone = DEFAULT_TZ) {
  const zoned = toZonedTime(now, timeZone)

  if (period === 'day') {
    zoned.setHours(0, 0, 0, 0)
    return fromZonedTime(zoned, timeZone)
  }

  if (period === 'week') {
    // Monday-start week.
    const day = (zoned.getDay() + 6) % 7
    zoned.setDate(zoned.getDate() - day)
    zoned.setHours(0, 0, 0, 0)
    return fromZonedTime(zoned, timeZone)
  }

  if (period === 'month') {
    zoned.setDate(1)
    zoned.setHours(0, 0, 0, 0)
    return fromZonedTime(zoned, timeZone)
  }

  const q = Math.floor(zoned.getMonth() / 3)
  zoned.setMonth(q * 3, 1)
  zoned.setHours(0, 0, 0, 0)
  return fromZonedTime(zoned, timeZone)
}
