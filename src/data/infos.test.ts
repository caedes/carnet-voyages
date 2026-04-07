import { describe, it, expect } from 'vitest'
import {
  BUDGET_CATEGORIES,
  BUDGET_TOTAL_CONFIRMED,
  BUDGET_EXTRA,
  TRIP_STATS,
  CONTACTS,
  GENERAL_TIPS,
} from './infos'

describe('BUDGET_CATEGORIES', () => {
  it('has at least one category', () => {
    expect(BUDGET_CATEGORIES.length).toBeGreaterThan(0)
  })

  it('every item has label, amount, and status', () => {
    BUDGET_CATEGORIES.forEach((cat) => {
      expect(cat.category).toBeTruthy()
      expect(cat.items.length).toBeGreaterThan(0)
      cat.items.forEach((item) => {
        expect(item.label).toBeTruthy()
        expect(item.amount).toMatch(/€/)
        expect(['confirmed', 'estimated']).toContain(item.status)
      })
    })
  })
})

describe('BUDGET_TOTAL_CONFIRMED', () => {
  it('is a string containing €', () => {
    expect(BUDGET_TOTAL_CONFIRMED).toContain('€')
  })
})

describe('BUDGET_EXTRA', () => {
  it('is a non-empty string', () => {
    expect(BUDGET_EXTRA.length).toBeGreaterThan(0)
  })
})

describe('TRIP_STATS', () => {
  it('has days, nights, and km', () => {
    expect(TRIP_STATS.days).toBeTypeOf('number')
    expect(TRIP_STATS.nights).toBeTypeOf('number')
    expect(TRIP_STATS.km).toBeTruthy()
  })

  it('nights is days minus 1', () => {
    expect(TRIP_STATS.nights).toBe(TRIP_STATS.days - 1)
  })
})

describe('CONTACTS', () => {
  it('is a non-empty array', () => {
    expect(CONTACTS.length).toBeGreaterThan(0)
  })

  it('every contact has icon, label, and detail', () => {
    CONTACTS.forEach((c) => {
      expect(c.icon).toBeTruthy()
      expect(c.label).toBeTruthy()
      expect(c.detail).toBeTruthy()
    })
  })
})

describe('GENERAL_TIPS', () => {
  it('is a non-empty array of strings', () => {
    expect(GENERAL_TIPS.length).toBeGreaterThan(0)
    GENERAL_TIPS.forEach((tip) => {
      expect(tip).toBeTypeOf('string')
      expect(tip.length).toBeGreaterThan(0)
    })
  })
})
