import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: JoursPage,
})

function JoursPage() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h1>Jours — à venir</h1>
    </div>
  )
}
