import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ConfigProvider, Spin, theme } from 'antd'
import frFR from 'antd/locale/fr_FR'
import { useAuth } from '#/lib/auth'
import BottomTabs from '#/components/BottomTabs'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  const auth = useAuth()

  if (auth.status === 'loading') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    )
  }

  if (auth.status === 'unauthenticated') {
    window.location.href = '/login'
    return null
  }

  return (
    <ConfigProvider
      locale={frFR}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 12,
        },
      }}
    >
      <div style={{ paddingBottom: 72 }}>
        <Outlet />
      </div>
      <BottomTabs />
    </ConfigProvider>
  )
}
