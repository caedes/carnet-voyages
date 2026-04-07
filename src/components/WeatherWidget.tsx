import { Spin } from 'antd'
import { useWeather, getWeatherDisplay } from '#/lib/weather'

type Props = { lat: number; lng: number; date: string }

export default function WeatherWidget({ lat, lng, date }: Props) {
  const { data, isLoading, error } = useWeather(lat, lng, date)

  if (isLoading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #1e293b)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
        <Spin />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ background: '#1e293b', borderRadius: 12, padding: '14px 16px', color: '#64748b', fontSize: 13 }}>
        Météo indisponible
      </div>
    )
  }

  const display = getWeatherDisplay(data.weatherCode)

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3a5f, #1e293b)',
      borderRadius: 12, padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{ fontSize: 36 }}>{display.icon}</div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#e2e8f0' }}>{Math.round(data.temperatureMean)}°C</div>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>{display.label} · Vent {Math.round(data.windSpeed)} km/h</div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Min {Math.round(data.temperatureMin)}° · Max {Math.round(data.temperatureMax)}° · 💧 {data.precipitationProbability}%</div>
      </div>
    </div>
  )
}
