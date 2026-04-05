import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Spin } from 'antd'
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
    <>
      <div style={{ paddingBottom: 72, minHeight: '100vh', background: '#0f172a', color: '#e2e8f0' }}>
        <Outlet />
      </div>
      <BottomTabs />
    </>
  )
}
