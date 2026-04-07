import { createFileRoute } from '@tanstack/react-router'
import { Typography, Empty, Spin, Image } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import { useAllMemories } from '#/lib/memories'
import { ITINERARY } from '#/data/itinerary'
import type { Memory } from '#/data/types'

const { Title, Text } = Typography

export const Route = createFileRoute('/_app/souvenirs')({
  component: SouvenirsPage,
})

function SouvenirsPage() {
  const { data: memories = [], isLoading } = useAllMemories()

  if (isLoading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  const grouped = ITINERARY
    .map((day) => ({
      day,
      memories: memories.filter((m) => m.dayId === day.id),
    }))
    .filter(({ memories: dayMemories }) => dayMemories.length > 0)

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
        Nos souvenirs
      </Title>

      {grouped.length === 0 ? (
        <Empty description="Aucun souvenir pour le moment" />
      ) : (
        grouped.map(({ day, memories: dayMemories }) => (
          <div key={day.id} style={{ marginBottom: 32 }}>
            <Title
              level={4}
              style={{ color: '#6366f1', marginBottom: 16 }}
            >
              J{day.number} · {day.title}
            </Title>

            {dayMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
        ))
      )}
    </div>
  )
}

function MemoryCard({ memory }: { memory: Memory }) {
  const photos = memory.media.filter((m) => m.type === 'photo')
  const videos = memory.media.filter((m) => m.type === 'video')

  return (
    <div
      style={{
        background: '#1e293b',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <Text style={{ color: '#94a3b8', fontSize: 12 }}>
        {memory.stageLabel}
      </Text>

      {(photos.length > 0 || videos.length > 0) && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 12,
          }}
        >
          {photos.length > 0 && (
            <Image.PreviewGroup>
              {photos.map((item, i) => (
                <Image
                  key={i}
                  src={item.thumbnailUrl}
                  preview={{ src: item.originalUrl }}
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover', borderRadius: 8 }}
                />
              ))}
            </Image.PreviewGroup>
          )}

          {videos.map((item, i) => (
            <a
              key={`video-${i}`}
              href={item.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ position: 'relative', display: 'inline-block' }}
            >
              <img
                src={item.thumbnailUrl}
                width={80}
                height={80}
                style={{ objectFit: 'cover', borderRadius: 8 }}
              />
              <PlayCircleOutlined
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: 28,
                  color: 'rgba(255, 255, 255, 0.85)',
                }}
              />
            </a>
          ))}
        </div>
      )}

      {memory.description && (
        <Text
          style={{
            display: 'block',
            fontStyle: 'italic',
            color: '#e2e8f0',
            marginTop: 12,
          }}
        >
          "{memory.description}"
        </Text>
      )}

      <Text
        style={{
          display: 'block',
          color: '#94a3b8',
          fontSize: 12,
          marginTop: 8,
        }}
      >
        — {memory.authorName}
      </Text>
    </div>
  )
}
