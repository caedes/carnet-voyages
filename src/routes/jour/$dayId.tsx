import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button, Typography, Card, Empty } from 'antd'
import {
  LeftOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { getDay } from '#/data/itinerary'
import WeatherWidget from '#/components/WeatherWidget'
import { useMemoriesByDay } from '#/lib/memories'

const { Text } = Typography

export const Route = createFileRoute('/jour/$dayId')({
  component: DayDetailPage,
})

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        color: '#6366f1',
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 1,
      }}
    >
      {children}
    </Text>
  )
}

function DayDetailPage() {
  const { dayId } = Route.useParams()
  const navigate = useNavigate()
  const day = getDay(dayId)
  const { data: memories = [] } = useMemoriesByDay(dayId)

  if (!day) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Empty description="Jour introuvable" />
      </div>
    )
  }

  const formattedDate = new Date(day.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const memoriesByStage = day.stages.map((stage) => ({
    stage,
    memories: memories.filter((m) => m.stageLabel === stage),
  }))

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        padding: '24px 16px',
        paddingBottom: 80,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={() => navigate({ to: '/' })}
          style={{ color: '#e2e8f0', padding: 0, marginBottom: 12 }}
        />
        <Text
          style={{
            display: 'block',
            color: '#e2e8f0',
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          J{day.number} · {day.title}
        </Text>
        <Text style={{ color: '#94a3b8', fontSize: 14 }}>
          {formattedDate}
        </Text>
        <Text style={{ color: '#94a3b8', fontSize: 14, marginLeft: 12 }}>
          {day.distance}
        </Text>
      </div>

      {/* Weather */}
      <div style={{ marginBottom: 24 }}>
        <WeatherWidget
          lat={day.location.lat}
          lng={day.location.lng}
          date={day.date}
        />
      </div>

      {/* Schedule */}
      {day.schedule.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionTitle>Programme</SectionTitle>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginTop: 10,
            }}
          >
            {day.schedule.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                <Text
                  style={{
                    color: '#6366f1',
                    fontSize: 13,
                    fontWeight: 600,
                    minWidth: 50,
                  }}
                >
                  {item.time}
                </Text>
                <div>
                  <Text
                    style={{
                      color: '#e2e8f0',
                      fontSize: 14,
                      fontWeight: 600,
                      display: 'block',
                    }}
                  >
                    {item.label}
                  </Text>
                  {item.description && (
                    <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                      {item.description}
                    </Text>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Routes */}
      {day.routes.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionTitle>Itinéraires</SectionTitle>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginTop: 10,
            }}
          >
            {day.routes.map((route, i) => (
              <a
                key={i}
                href={route.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Card
                  style={{
                    background: '#334155',
                    border: 'none',
                    borderRadius: 10,
                  }}
                  styles={{ body: { padding: '12px 14px' } }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <EnvironmentOutlined
                          style={{ color: '#6366f1', fontSize: 14 }}
                        />
                        <Text
                          style={{
                            color: '#e2e8f0',
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {route.from} → {route.to}
                        </Text>
                      </div>
                      <Text
                        style={{
                          color: '#94a3b8',
                          fontSize: 12,
                          marginTop: 2,
                          display: 'block',
                        }}
                      >
                        {route.distance} · {route.duration}
                      </Text>
                    </div>
                    <Text style={{ color: '#6366f1', fontSize: 13 }}>
                      Maps ↗
                    </Text>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      {day.documents.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionTitle>Documents</SectionTitle>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginTop: 10,
            }}
          >
            {day.documents.map((doc, i) => (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Card
                  style={{
                    background: '#334155',
                    border: 'none',
                    borderRadius: 10,
                  }}
                  styles={{ body: { padding: '12px 14px' } }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{doc.icon}</span>
                      <div>
                        <Text
                          style={{
                            color: '#e2e8f0',
                            fontSize: 14,
                            fontWeight: 600,
                            display: 'block',
                          }}
                        >
                          {doc.label}
                        </Text>
                        <Text style={{ color: '#94a3b8', fontSize: 12 }}>
                          {doc.detail}
                        </Text>
                      </div>
                    </div>
                    <Text style={{ color: '#6366f1', fontSize: 13 }}>
                      Ouvrir ↗
                    </Text>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Memories */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <SectionTitle>Nos souvenirs</SectionTitle>
          <Link
            to="/jour/$dayId/souvenir/nouveau"
            params={{ dayId }}
            style={{ textDecoration: 'none' }}
          >
            <Button
              type="text"
              icon={<PlusOutlined />}
              style={{ color: '#6366f1', fontSize: 13, padding: '0 4px' }}
            >
              Ajouter
            </Button>
          </Link>
        </div>

        {memories.length === 0 ? (
          <Card
            style={{
              background: '#1e293b',
              border: 'none',
              borderRadius: 10,
            }}
            styles={{ body: { padding: '24px 16px', textAlign: 'center' } }}
          >
            <Empty
              description={
                <Text style={{ color: '#64748b' }}>
                  Aucun souvenir pour cette journée
                </Text>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {memoriesByStage.map(({ stage, memories: stageMemories }) => {
              if (stageMemories.length === 0) return null
              return (
                <div key={stage}>
                  <Text
                    style={{
                      color: '#94a3b8',
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      display: 'block',
                      marginBottom: 8,
                    }}
                  >
                    {stage}
                  </Text>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    {stageMemories.map((memory) => (
                      <Card
                        key={memory.id}
                        style={{
                          background: '#1e293b',
                          border: 'none',
                          borderRadius: 10,
                        }}
                        styles={{ body: { padding: '12px 14px' } }}
                      >
                        {/* Thumbnail grid */}
                        {memory.media.length > 0 && (
                          <div
                            style={{
                              display: 'flex',
                              gap: 6,
                              flexWrap: 'wrap',
                              marginBottom: 8,
                            }}
                          >
                            {memory.media.map((item, idx) => (
                              <div
                                key={idx}
                                style={{
                                  width: 64,
                                  height: 64,
                                  borderRadius: 8,
                                  overflow: 'hidden',
                                  position: 'relative',
                                }}
                              >
                                <img
                                  src={item.thumbnailUrl}
                                  alt=""
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                  }}
                                />
                                {item.type === 'video' && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      background: 'rgba(0,0,0,0.3)',
                                    }}
                                  >
                                    <PlayCircleOutlined
                                      style={{
                                        color: '#fff',
                                        fontSize: 22,
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {memory.description && (
                          <Text
                            style={{
                              color: '#cbd5e1',
                              fontSize: 13,
                              fontStyle: 'italic',
                              display: 'block',
                            }}
                          >
                            &laquo; {memory.description} &raquo;
                          </Text>
                        )}
                        <Text
                          style={{
                            color: '#94a3b8',
                            fontSize: 12,
                            display: 'block',
                            marginTop: 4,
                          }}
                        >
                          — {memory.authorName}
                        </Text>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
