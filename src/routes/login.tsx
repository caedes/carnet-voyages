import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Typography, Space, message } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import { signIn, isFamilyMember } from '#/lib/auth'

const { Title, Text } = Typography

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()

  async function handleLogin() {
    try {
      const result = await signIn()
      const allowed = await isFamilyMember(result.user)
      if (!allowed) {
        message.error('Ce voyage est privé. Accès réservé à la famille.')
        return
      }
      navigate({ to: '/' })
    } catch {
      message.error('Erreur de connexion. Réessayez.')
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 24,
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
      color: '#e2e8f0',
    }}>
      <Space orientation="vertical" align="center" size="large">
        <div style={{ fontSize: 48 }}>🍁</div>
        <Title level={2} style={{ color: '#e2e8f0', margin: 0 }}>
          La Boucle des Traditions
        </Title>
        <Text style={{ color: '#94a3b8', fontSize: 16 }}>
          Québec &amp; Ontario · Avril 2026
        </Text>
        <Button
          type="primary"
          size="large"
          icon={<GoogleOutlined />}
          onClick={handleLogin}
          style={{ marginTop: 32 }}
        >
          Se connecter avec Google
        </Button>
      </Space>
    </div>
  )
}
