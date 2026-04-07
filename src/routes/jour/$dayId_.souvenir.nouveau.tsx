import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Input, message, Progress } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { getDay } from '#/data/itinerary'
import { useFamilyMembers } from '#/data/family'
import { useAuth } from '#/lib/auth'
import { useCreateMemory } from '#/lib/memories'
import { uploadMedia } from '#/lib/storage'
import MediaUpload from '#/components/MediaUpload'
import type { MediaItem } from '#/data/types'

export const Route = createFileRoute('/jour/$dayId_/souvenir/nouveau')({
  component: AddMemoryPage,
})

function AddMemoryPage() {
  const { dayId } = Route.useParams()
  const navigate = useNavigate()
  const day = getDay(dayId)
  const auth = useAuth()
  const createMemory = useCreateMemory()
  const { data: familyMembers = [] } = useFamilyMembers()

  const [selectedStage, setSelectedStage] = useState(day?.stages[0] ?? '')
  const [files, setFiles] = useState<File[]>([])
  const [description, setDescription] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState<{ email: string; name: string; initial: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (familyMembers.length > 0 && !selectedAuthor) {
      if (auth.status === 'authenticated') {
        const member = familyMembers.find((m) => m.email === auth.user.email)
        setSelectedAuthor(member ?? familyMembers[0])
      } else {
        setSelectedAuthor(familyMembers[0])
      }
    }
  }, [familyMembers, auth, selectedAuthor])

  if (!day) return null

  const handlePublish = async () => {
    if (files.length === 0 && !description.trim()) {
      message.warning('Ajoutez au moins une photo ou une description')
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      const tempId = `${dayId}-${Date.now()}`
      const mediaItems: MediaItem[] = []

      for (let i = 0; i < files.length; i++) {
        const result = await uploadMedia(tempId, files[i])
        mediaItems.push(result)
        setProgress(Math.round(((i + 1) / files.length) * 100))
      }

      await createMemory.mutateAsync({
        dayId,
        stageLabel: selectedStage,
        description: description.trim(),
        authorEmail: selectedAuthor?.email ?? '',
        authorName: selectedAuthor?.name ?? '',
        media: mediaItems,
      })

      message.success('Souvenir ajout\u00e9 !')
      navigate({ to: '/jour/$dayId', params: { dayId } })
    } catch {
      message.error('Erreur lors de la publication')
    } finally {
      setUploading(false)
    }
  }

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={() => navigate({ to: '/jour/$dayId', params: { dayId } })}
          style={{ color: '#e2e8f0', padding: 0 }}
        >
          Retour
        </Button>
        <span
          style={{
            color: '#e2e8f0',
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          Nouveau souvenir
        </span>
        <Button
          type="primary"
          onClick={handlePublish}
          loading={uploading}
          style={{
            background: '#6366f1',
            borderColor: '#6366f1',
            borderRadius: 8,
          }}
        >
          Publier
        </Button>
      </div>

      {/* Stage selection */}
      <div style={{ marginBottom: 24 }}>
        <span
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
          Rattacher \u00e0 \u00b7 J{day.number}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {day.stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                background:
                  selectedStage === stage ? '#6366f1' : '#334155',
                color:
                  selectedStage === stage ? '#fff' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Media upload */}
      <div style={{ marginBottom: 24 }}>
        <MediaUpload files={files} onChange={setFiles} />
      </div>

      {/* Description */}
      <div style={{ marginBottom: 24 }}>
        <Input.TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Racontez ce moment..."
          rows={4}
          style={{
            background: '#0f172a',
            border: 'none',
            color: '#e2e8f0',
            fontSize: 14,
            borderRadius: 10,
          }}
        />
      </div>

      {/* Author selection */}
      <div style={{ marginBottom: 24 }}>
        <span
          style={{
            color: '#94a3b8',
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            display: 'block',
            marginBottom: 10,
          }}
        >
          Auteur
        </span>
        <div style={{ display: 'flex', gap: 12 }}>
          {familyMembers.map((member) => (
            <button
              key={member.email}
              onClick={() => setSelectedAuthor(member)}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border:
                  selectedAuthor?.email === member.email
                    ? '3px solid #6366f1'
                    : '3px solid transparent',
                background:
                  selectedAuthor?.email === member.email
                    ? '#6366f1'
                    : '#334155',
                color: '#fff',
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                transition: 'all 0.2s',
              }}
            >
              {member.initial}
            </button>
          ))}
        </div>
      </div>

      {/* Upload progress */}
      {uploading && (
        <div style={{ marginBottom: 24 }}>
          <Progress
            percent={progress}
            strokeColor="#6366f1"
            trailColor="#334155"
          />
        </div>
      )}
    </div>
  )
}
