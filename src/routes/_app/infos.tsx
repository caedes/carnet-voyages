import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, Typography, Button, message } from 'antd'
import { PhoneOutlined, FilePdfOutlined } from '@ant-design/icons'
import { ref, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage } from '#/lib/firebase'
import {
  BUDGET_CATEGORIES,
  BUDGET_TOTAL_CONFIRMED,
  BUDGET_EXTRA,
  TRIP_STATS,
  CONTACTS,
  GENERAL_TIPS,
} from '#/data/infos'

const { Text } = Typography

export const Route = createFileRoute('/_app/infos')({
  component: InfosPage,
})

const cardStyle = {
  background: '#1e293b',
  borderRadius: 12,
  border: 'none',
}

const sectionTitle = (text: string) => (
  <Text
    strong
    style={{
      color: '#818cf8',
      textTransform: 'uppercase' as const,
      fontSize: 12,
      letterSpacing: 1,
    }}
  >
    {text}
  </Text>
)

function InfosPage() {
  const [pdfLoading, setPdfLoading] = useState(false)

  const handleOpenPdf = async () => {
    setPdfLoading(true)
    try {
      const storage = getFirebaseStorage()
      const pdfRef = ref(storage, 'documents/carnet_canada_2026_CLV_v3.pdf')
      const url = await getDownloadURL(pdfRef)
      window.open(url, '_blank')
    } catch {
      message.error('Impossible de charger le carnet de voyage.')
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Carnet de voyage PDF */}
      <Card style={cardStyle}>
        {sectionTitle('Carnet de voyage')}
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={handleOpenPdf}
            loading={pdfLoading}
            style={{
              background: '#6366f1',
              borderColor: '#6366f1',
              borderRadius: 8,
            }}
          >
            Voir le carnet de voyage
          </Button>
        </div>
      </Card>

      {/* Budget */}
      <Card style={cardStyle}>
        {sectionTitle('Budget')}
        {BUDGET_CATEGORIES.map((cat) => (
          <div key={cat.category} style={{ marginTop: 16 }}>
            <Text strong style={{ color: '#e2e8f0', fontSize: 14 }}>
              {cat.category}
            </Text>
            {cat.items.map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 0',
                }}
              >
                <Text style={{ color: '#94a3b8', fontSize: 13 }}>{item.label}</Text>
                <Text
                  style={{
                    color: '#94a3b8',
                    fontSize: 13,
                    whiteSpace: 'nowrap',
                    marginLeft: 12,
                  }}
                >
                  {item.amount}
                </Text>
              </div>
            ))}
          </div>
        ))}
        <div
          style={{
            borderTop: '1px solid #334155',
            marginTop: 16,
            paddingTop: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text strong style={{ color: '#818cf8', fontSize: 14 }}>
            Total confirmé
          </Text>
          <Text strong style={{ color: '#818cf8', fontSize: 14 }}>
            {BUDGET_TOTAL_CONFIRMED}
          </Text>
        </div>
        <Text style={{ color: '#64748b', fontSize: 12, marginTop: 8, display: 'block' }}>
          {BUDGET_EXTRA}
        </Text>
      </Card>

      {/* Trip stats */}
      <Card style={cardStyle}>
        {sectionTitle('Le voyage en chiffres')}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginTop: 16,
          }}
        >
          {[
            { value: TRIP_STATS.days, label: 'jours' },
            { value: `${TRIP_STATS.km} km`, label: 'parcourus' },
            { value: TRIP_STATS.nights, label: 'nuits' },
            { value: TRIP_STATS.souvenirs, label: 'souvenirs' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#0f172a',
                borderRadius: 8,
                padding: 16,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0' }}>
                {stat.value}
              </div>
              <Text style={{ color: '#94a3b8', fontSize: 13 }}>{stat.label}</Text>
            </div>
          ))}
        </div>
      </Card>

      {/* Contacts */}
      <Card style={cardStyle}>
        {sectionTitle('Contacts utiles')}
        <div style={{ marginTop: 16 }}>
          {CONTACTS.map((contact, i) => (
            <div
              key={contact.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: i < CONTACTS.length - 1 ? '1px solid #334155' : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>{contact.icon}</span>
                <div>
                  <Text strong style={{ color: '#e2e8f0', fontSize: 14, display: 'block' }}>
                    {contact.label}
                  </Text>
                  <Text style={{ color: '#94a3b8', fontSize: 12 }}>{contact.detail}</Text>
                </div>
              </div>
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  style={{
                    color: '#818cf8',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <PhoneOutlined /> Appeler
                </a>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Tips */}
      <Card style={cardStyle}>
        {sectionTitle('Conseils & rappels')}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {GENERAL_TIPS.map((tip) => (
            <Text key={tip} style={{ color: '#e2e8f0', fontSize: 13 }}>
              {tip}
            </Text>
          ))}
        </div>
      </Card>
    </div>
  )
}
