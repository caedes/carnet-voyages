import { describe, it, expect } from 'vitest'
import { getWeatherDisplay } from './weather'

describe('getWeatherDisplay', () => {
  it('returns sunny for code 0', () => {
    expect(getWeatherDisplay(0)).toEqual({ icon: '☀️', label: 'Ensoleillé' })
  })

  it('returns rain for code 63', () => {
    expect(getWeatherDisplay(63)).toEqual({ icon: '🌧️', label: 'Pluie' })
  })

  it('returns heavy snow for code 75', () => {
    expect(getWeatherDisplay(75)).toEqual({ icon: '❄️', label: 'Forte neige' })
  })

  it('returns storm for code 95', () => {
    expect(getWeatherDisplay(95)).toEqual({ icon: '⛈️', label: 'Orage' })
  })

  it('returns fallback for unknown code', () => {
    expect(getWeatherDisplay(999)).toEqual({ icon: '🌡️', label: 'Inconnu' })
  })
})
