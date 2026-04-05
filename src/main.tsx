import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import * as Sentry from '@sentry/react'
import { getRouter } from './router'
import './styles.css'

Sentry.init({
  dsn: 'https://cc4032fc879a4628c450357484e984a1@o4511166335090688.ingest.de.sentry.io/4511166346297424',
  sendDefaultPii: true,
})

const router = getRouter()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
