import { useQuery } from '@tanstack/react-query'

type WeatherData = {
  temperatureMax: number
  temperatureMin: number
  temperatureMean: number
  precipitationProbability: number
  windSpeed: number
  weatherCode: number
}

const WEATHER_CODES: Record<number, { icon: string; label: string }> = {
  0: { icon: '☀️', label: 'Ensoleillé' },
  1: { icon: '🌤️', label: 'Peu nuageux' },
  2: { icon: '⛅', label: 'Partiellement nuageux' },
  3: { icon: '☁️', label: 'Nuageux' },
  45: { icon: '🌫️', label: 'Brouillard' },
  48: { icon: '🌫️', label: 'Brouillard givrant' },
  51: { icon: '🌦️', label: 'Bruine légère' },
  53: { icon: '🌦️', label: 'Bruine' },
  55: { icon: '🌧️', label: 'Bruine dense' },
  61: { icon: '🌧️', label: 'Pluie légère' },
  63: { icon: '🌧️', label: 'Pluie' },
  65: { icon: '🌧️', label: 'Forte pluie' },
  71: { icon: '🌨️', label: 'Neige légère' },
  73: { icon: '🌨️', label: 'Neige' },
  75: { icon: '❄️', label: 'Forte neige' },
  80: { icon: '🌦️', label: 'Averses' },
  81: { icon: '🌧️', label: 'Averses modérées' },
  82: { icon: '🌧️', label: 'Fortes averses' },
  85: { icon: '🌨️', label: 'Averses de neige' },
  86: { icon: '🌨️', label: 'Fortes averses de neige' },
  95: { icon: '⛈️', label: 'Orage' },
  96: { icon: '⛈️', label: 'Orage avec grêle' },
  99: { icon: '⛈️', label: 'Orage violent' },
}

export function getWeatherDisplay(code: number) {
  return WEATHER_CODES[code] ?? { icon: '🌡️', label: 'Inconnu' }
}

export async function fetchWeather(lat: number, lng: number, date: string): Promise<WeatherData | null> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_probability_max,wind_speed_10m_max,weather_code&start_date=${date}&end_date=${date}&timezone=America/Toronto`

  const res = await fetch(url)
  if (!res.ok) return null

  const data = await res.json()
  const daily = data.daily
  if (!daily || !daily.time?.length) return null

  return {
    temperatureMax: daily.temperature_2m_max[0],
    temperatureMin: daily.temperature_2m_min[0],
    temperatureMean: daily.temperature_2m_mean[0],
    precipitationProbability: daily.precipitation_probability_max[0],
    windSpeed: daily.wind_speed_10m_max[0],
    weatherCode: daily.weather_code[0],
  }
}

export function useWeather(lat: number, lng: number, date: string) {
  return useQuery({
    queryKey: ['weather', lat, lng, date],
    queryFn: () => fetchWeather(lat, lng, date),
    staleTime: 3 * 60 * 60 * 1000,
    retry: 1,
  })
}
