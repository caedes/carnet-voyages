import { CalendarOutlined, CameraOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from '@tanstack/react-router'

const tabs = [
  { key: '/', label: 'Jours', icon: <CalendarOutlined /> },
  { key: '/souvenirs', label: 'Souvenirs', icon: <CameraOutlined /> },
  { key: '/infos', label: 'Infos', icon: <InfoCircleOutlined /> },
] as const

export default function BottomTabs() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 56,
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: '#0f172a',
        borderTop: '1px solid #1e293b',
        zIndex: 1000,
      }}
    >
      {tabs.map((tab) => {
        const isActive =
          tab.key === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(tab.key)

        return (
          <button
            key={tab.key}
            onClick={() => navigate({ to: tab.key })}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              color: isActive ? '#6366f1' : '#64748b',
              fontSize: 20,
              cursor: 'pointer',
              padding: '4px 16px',
            }}
          >
            {tab.icon}
            <span style={{ fontSize: 11 }}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
