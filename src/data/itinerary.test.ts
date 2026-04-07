import { describe, it, expect, vi, afterEach } from 'vitest'
import { ITINERARY, getDay, getTodayDay } from './itinerary'

describe('getDay', () => {
  it('returns the correct day for a valid ID', () => {
    const day = getDay('j1')
    expect(day).toBeDefined()
    expect(day!.id).toBe('j1')
    expect(day!.number).toBe(1)
    expect(day!.title).toBe('Arrivée à Montréal')
  })

  it('returns the last day for j11', () => {
    const day = getDay('j11')
    expect(day).toBeDefined()
    expect(day!.number).toBe(11)
  })

  it('returns undefined for a nonexistent ID', () => {
    expect(getDay('j99')).toBeUndefined()
  })

  it('returns undefined for an empty string', () => {
    expect(getDay('')).toBeUndefined()
  })
})

describe('getTodayDay', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the matching day when today is a trip date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-08T12:00:00'))

    const day = getTodayDay()
    expect(day).toBeDefined()
    expect(day!.id).toBe('j1')
    expect(day!.date).toBe('2026-04-08')
  })

  it('returns undefined when today is outside the trip dates', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T12:00:00'))

    expect(getTodayDay()).toBeUndefined()
  })
})

describe('ITINERARY integrity', () => {
  it('has exactly 11 days', () => {
    expect(ITINERARY).toHaveLength(11)
  })

  it('has unique IDs', () => {
    const ids = ITINERARY.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has chronologically ordered dates', () => {
    for (let i = 1; i < ITINERARY.length; i++) {
      expect(ITINERARY[i].date > ITINERARY[i - 1].date).toBe(true)
    }
  })

  it('has sequential day numbers from 1 to 11', () => {
    ITINERARY.forEach((day, i) => {
      expect(day.number).toBe(i + 1)
    })
  })

  it('has required fields on every day', () => {
    ITINERARY.forEach((day) => {
      expect(day.id).toBeTruthy()
      expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(day.title).toBeTruthy()
      expect(day.location).toBeDefined()
      expect(day.location.lat).toBeTypeOf('number')
      expect(day.location.lng).toBeTypeOf('number')
      expect(Array.isArray(day.schedule)).toBe(true)
      expect(Array.isArray(day.stages)).toBe(true)
      expect(day.stages.length).toBeGreaterThan(0)
    })
  })
})
