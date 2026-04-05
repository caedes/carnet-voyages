import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/souvenirs')({
  component: SouvenirsPage,
})

function SouvenirsPage() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h1>Souvenirs — à venir</h1>
    </div>
  )
}
