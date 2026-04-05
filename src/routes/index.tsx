import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h1>Carnet de Voyages</h1>
      <p>La Boucle des Traditions — Canada 2026</p>
    </div>
  )
}
