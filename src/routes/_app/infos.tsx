import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/infos')({
  component: InfosPage,
})

function InfosPage() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h1>Infos — à venir</h1>
    </div>
  )
}
