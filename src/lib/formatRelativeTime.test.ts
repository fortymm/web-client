import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatRelativeTime } from './formatRelativeTime'

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-03-20T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "just now" for less than 1 minute ago', () => {
    const thirtySecondsAgo = new Date('2025-03-20T11:59:30.000Z').toISOString()
    expect(formatRelativeTime(thirtySecondsAgo)).toBe('just now')
  })

  it('returns minutes ago for 1-59 minutes', () => {
    const fiveMinutesAgo = new Date('2025-03-20T11:55:00.000Z').toISOString()
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago')
  })

  it('returns "1m ago" for exactly 1 minute', () => {
    const oneMinuteAgo = new Date('2025-03-20T11:59:00.000Z').toISOString()
    expect(formatRelativeTime(oneMinuteAgo)).toBe('1m ago')
  })

  it('returns "59m ago" for 59 minutes', () => {
    const fiftyNineMinutesAgo = new Date('2025-03-20T11:01:00.000Z').toISOString()
    expect(formatRelativeTime(fiftyNineMinutesAgo)).toBe('59m ago')
  })

  it('returns hours ago for 1-23 hours', () => {
    const twoHoursAgo = new Date('2025-03-20T10:00:00.000Z').toISOString()
    expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago')
  })

  it('returns "1h ago" for exactly 1 hour', () => {
    const oneHourAgo = new Date('2025-03-20T11:00:00.000Z').toISOString()
    expect(formatRelativeTime(oneHourAgo)).toBe('1h ago')
  })

  it('returns "23h ago" for 23 hours', () => {
    const twentyThreeHoursAgo = new Date('2025-03-19T13:00:00.000Z').toISOString()
    expect(formatRelativeTime(twentyThreeHoursAgo)).toBe('23h ago')
  })

  it('returns days ago for 1-6 days', () => {
    const threeDaysAgo = new Date('2025-03-17T12:00:00.000Z').toISOString()
    expect(formatRelativeTime(threeDaysAgo)).toBe('3d ago')
  })

  it('returns "1d ago" for exactly 1 day', () => {
    const oneDayAgo = new Date('2025-03-19T12:00:00.000Z').toISOString()
    expect(formatRelativeTime(oneDayAgo)).toBe('1d ago')
  })

  it('returns "6d ago" for 6 days', () => {
    const sixDaysAgo = new Date('2025-03-14T12:00:00.000Z').toISOString()
    expect(formatRelativeTime(sixDaysAgo)).toBe('6d ago')
  })

  it('returns formatted date for 7+ days ago', () => {
    const sevenDaysAgo = new Date('2025-03-13T12:00:00.000Z').toISOString()
    expect(formatRelativeTime(sevenDaysAgo)).toBe('Mar 13')
  })

  it('returns formatted date for dates in previous months', () => {
    const lastMonth = new Date('2025-02-15T12:00:00.000Z').toISOString()
    expect(formatRelativeTime(lastMonth)).toBe('Feb 15')
  })

  it('returns formatted date for dates in previous years', () => {
    const lastYear = new Date('2024-12-25T12:00:00.000Z').toISOString()
    expect(formatRelativeTime(lastYear)).toBe('Dec 25')
  })
})
