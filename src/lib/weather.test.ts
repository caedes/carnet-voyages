import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getWeatherDisplay, fetchWeather } from './weather'

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

describe('fetchWeather', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns parsed weather data on success', async () => {
    const mockDaily = {
      time: ['2026-04-08'],
      temperature_2m_max: [12],
      temperature_2m_min: [3],
      temperature_2m_mean: [7.5],
      precipitation_probability_max: [20],
      wind_speed_10m_max: [15],
      weather_code: [2],
    }

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ daily: mockDaily }),
    } as Response)

    const result = await fetchWeather(45.5, -73.5, '2026-04-08')

    expect(result).toEqual({
      temperatureMax: 12,
      temperatureMin: 3,
      temperatureMean: 7.5,
      precipitationProbability: 20,
      windSpeed: 15,
      weatherCode: 2,
    })
    expect(fetch).toHaveBeenCalledOnce()
    expect(vi.mocked(fetch).mock.calls[0][0]).toContain('latitude=45.5')
    expect(vi.mocked(fetch).mock.calls[0][0]).toContain('longitude=-73.5')
    expect(vi.mocked(fetch).mock.calls[0][0]).toContain('start_date=2026-04-08')
  })

  it('returns null on HTTP error', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    const result = await fetchWeather(45.5, -73.5, '2026-04-08')
    expect(result).toBeNull()
  })

  it('returns null when daily data is missing', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)

    const result = await fetchWeather(45.5, -73.5, '2026-04-08')
    expect(result).toBeNull()
  })

  it('returns null when daily.time is empty', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ daily: { time: [] } }),
    } as Response)

    const result = await fetchWeather(45.5, -73.5, '2026-04-08')
    expect(result).toBeNull()
  })
})
