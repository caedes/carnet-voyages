import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, Typography } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { ITINERARY, getTodayDay } from '#/data/itinerary'

const { Text, Title } = Typography

export const Route = createFileRoute('/_app/')({
  component: JoursPage,
})

function JoursPage() {
  const todayDay = getTodayDay()

  return (
    <div style={{ padding: '24px 16px', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={3} style={{ color: '#e2e8f0', margin: 0 }}>
          La Boucle des Traditions
        </Title>
        <Text style={{ color: '#6366f1', fontSize: 16 }}>
          8 – 18 avril 2026
        </Text>
        <br />
        <Text style={{ color: '#94a3b8', fontSize: 14 }}>
          Québec &amp; Ontario · 1 450 km
        </Text>
      </div>

      {/* Day cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ITINERARY.map((day) => {
          const isToday = todayDay?.id === day.id
          const formattedDate = new Date(day.date).toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })
          const distanceLabel = day.distance === '0 km' ? 'à pied' : day.distance

          return (
            <Link
              key={day.id}
              to="/jour/$dayId"
              params={{ dayId: day.id }}
              style={{ textDecoration: 'none' }}
            >
              <Card
                style={{
                  background: '#1e293b',
                  border: isToday ? '2px solid #6366f1' : '1px solid #334155',
                  borderRadius: 12,
                }}
                styles={{ body: { padding: '12px 16px' } }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  {/* Day badge */}
                  <div
                    style={{
                      background: isToday ? '#6366f1' : '#334155',
                      color: '#e2e8f0',
                      borderRadius: 8,
                      minWidth: 44,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    J{day.number}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: '#e2e8f0',
                          fontWeight: 600,
                          fontSize: 15,
                        }}
                        ellipsis
                      >
                        {day.title}
                      </Text>
                      {isToday && (
                        <span
                          style={{
                            background: '#6366f1',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 10,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Auj.
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                        {formattedDate}
                      </Text>
                      <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                        {distanceLabel}
                      </Text>
                    </div>
                  </div>

                  {/* Arrow */}
                  <RightOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
