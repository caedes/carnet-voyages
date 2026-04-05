# Carnet de Voyages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first family travel journal for a Canada road-trip (Apr 8-18, 2026) with day-by-day itinerary, weather forecasts, Google Maps links, document links, and shared photo/video memories.

**Architecture:** TanStack Start SSR app with file-based routing. Static itinerary data in JSON. Firebase Auth (Google) with email whitelist for access control. Firestore for memories, Firebase Storage for media with client-side thumbnail generation. Open-Meteo for weather forecasts. Ant Design for UI components and icons.

**Tech Stack:** TanStack Start (Vite 7, React 19), TanStack Router/Query/Form, Ant Design (antd + @ant-design/icons), Firebase (Auth, Firestore, Storage), Open-Meteo API, Sentry, Zod, Netlify

**Spec:** `docs/superpowers/specs/2026-04-05-carnet-voyages-design.md`

---

## File Structure

```
src/
├── routes/
│   ├── __root.tsx                  # Root layout: Ant Design ConfigProvider, auth guard, bottom tabs
│   ├── _app.tsx                    # Authenticated layout with bottom tabs
│   ├── _app/
│   │   ├── index.tsx               # Day list (home)
│   │   ├── souvenirs.tsx           # Global souvenirs gallery
│   │   └── infos.tsx               # Infos page (budget, contacts, tips)
│   ├── jour/
│   │   └── $dayId.tsx              # Day detail page
│   ├── jour_.$dayId.souvenir.nouveau.tsx  # Add memory form
│   └── login.tsx                   # Login page
├── components/
│   ├── BottomTabs.tsx              # Bottom tab bar (Jours/Souvenirs/Infos)
│   ├── WeatherWidget.tsx           # Weather display widget
│   ├── MemoryCard.tsx              # Memory display card (thumbnails + description)
│   └── MediaUpload.tsx             # Multi-file upload with preview + thumbnail generation
├── data/
│   ├── types.ts                    # All TypeScript types (Day, Memory, MediaItem, etc.)
│   ├── itinerary.ts                # Static itinerary JSON (11 days)
│   ├── family.ts                   # Family members mapping + allowed emails
│   └── infos.ts                    # Budget, contacts, tips static data
├── lib/
│   ├── firebase.ts                 # Firebase app init + auth + firestore + storage exports
│   ├── auth.ts                     # Auth helpers: signIn, signOut, useAuth hook, email check
│   ├── memories.ts                 # Firestore CRUD for memories collection
│   ├── storage.ts                  # Firebase Storage upload helpers (original + thumbnail)
│   ├── weather.ts                  # Open-Meteo API fetch + TanStack Query hook
│   └── media-utils.ts              # Client-side image compression + thumbnail generation + video poster
├── integrations/
│   └── tanstack-query/
│       ├── root-provider.tsx       # (existing) QueryClient provider
│       └── devtools.tsx            # (existing) DevTools
├── router.tsx                      # (existing, minor edits) Router setup
└── styles.css                      # Minimal global styles (Ant Design handles most styling)
```

**Firebase config files (project root):**
```
firestore.rules                     # Firestore security rules with email whitelist
storage.rules                       # Storage security rules with email whitelist
.env.local                          # Firebase config + ALLOWED_EMAILS (not committed)
```

---

## Task 0: Clean up demo code & install dependencies

**Files:**
- Delete: `src/components/demo.FormComponents.tsx`
- Delete: `src/hooks/demo.form.ts`
- Delete: `src/hooks/demo.form-context.ts`
- Delete: `src/components/Header.tsx`
- Delete: `src/components/Footer.tsx`
- Delete: `src/components/ThemeToggle.tsx`
- Delete: `src/routes/about.tsx`
- Modify: `src/routes/__root.tsx`
- Modify: `src/routes/index.tsx`
- Modify: `src/styles.css`
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `.env.local`
- Create: `.env.example`

- [ ] **Step 1: Delete demo files**

```bash
rm src/components/demo.FormComponents.tsx
rm src/hooks/demo.form.ts
rm src/hooks/demo.form-context.ts
rm src/components/Header.tsx
rm src/components/Footer.tsx
rm src/components/ThemeToggle.tsx
rm src/routes/about.tsx
```

- [ ] **Step 2: Install Ant Design and Firebase, remove Tailwind and Lucide**

```bash
yarn add antd @ant-design/icons firebase browser-image-compression
yarn remove tailwindcss @tailwindcss/vite lucide-react @tailwindcss/typography
```

- [ ] **Step 3: Update vite.config.ts — remove Tailwind plugin**

```typescript
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
```

- [ ] **Step 4: Replace styles.css with minimal global styles**

```css
/* Global styles — Ant Design handles component styling */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Mobile viewport fix */
html, body, #root {
  height: 100%;
}
```

- [ ] **Step 5: Strip __root.tsx to minimal shell**

```tsx
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1',
      },
      { title: 'Carnet de Voyages — Canada 2026' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Replace index.tsx with placeholder**

```tsx
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
```

- [ ] **Step 7: Create .env.example and .env.local**

`.env.example`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ALLOWED_EMAILS=email1@gmail.com,email2@gmail.com,email3@gmail.com
VITE_SENTRY_DSN=
```

`.env.local` — copy from `.env.example` and fill with real values (user provides Firebase project config).

- [ ] **Step 8: Verify app starts**

```bash
yarn dev
```

Expected: App runs on localhost:3000 with the placeholder "Carnet de Voyages" text. No errors in console.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: clean demo code, install antd + firebase, remove tailwind"
```

---

## Task 1: Types & static data

**Files:**
- Create: `src/data/types.ts`
- Create: `src/data/family.ts`
- Create: `src/data/itinerary.ts`
- Create: `src/data/infos.ts`

- [ ] **Step 1: Create types.ts**

```typescript
import type { Timestamp } from 'firebase/firestore'

export type Day = {
  id: string
  number: number
  date: string
  title: string
  subtitle: string
  distance: string
  duration: string
  location: {
    name: string
    lat: number
    lng: number
  }
  schedule: ScheduleItem[]
  routes: Route[]
  documents: TripDocument[]
  stages: string[]
  tips: string[]
}

export type ScheduleItem = {
  time: string
  label: string
  description?: string
}

export type Route = {
  from: string
  to: string
  distance: string
  duration: string
  googleMapsUrl: string
}

export type TripDocument = {
  icon: string
  label: string
  detail: string
  url: string
}

export type MediaItem = {
  filename: string
  type: 'photo' | 'video'
  originalUrl: string
  thumbnailUrl: string
  size: number
}

export type Memory = {
  id: string
  dayId: string
  stageLabel: string
  description: string
  authorEmail: string
  authorName: string
  media: MediaItem[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FamilyMember = {
  email: string
  name: string
  initial: string
}

export type BudgetItem = {
  label: string
  amount: string
  status: 'confirmed' | 'estimated'
}

export type Contact = {
  icon: string
  label: string
  detail: string
  phone?: string
}
```

- [ ] **Step 2: Create family.ts**

```typescript
import type { FamilyMember } from './types'

export const FAMILY_MEMBERS: FamilyMember[] = [
  { email: import.meta.env.VITE_ALLOWED_EMAILS?.split(',')[0] ?? '', name: 'Romain', initial: 'R' },
  { email: import.meta.env.VITE_ALLOWED_EMAILS?.split(',')[1] ?? '', name: 'Maman', initial: 'M' },
  { email: import.meta.env.VITE_ALLOWED_EMAILS?.split(',')[2] ?? '', name: 'Lily', initial: 'L' },
]

export const ALLOWED_EMAILS = import.meta.env.VITE_ALLOWED_EMAILS?.split(',') ?? []

export function isEmailAllowed(email: string): boolean {
  return ALLOWED_EMAILS.includes(email)
}

export function getFamilyMember(email: string): FamilyMember | undefined {
  return FAMILY_MEMBERS.find((m) => m.email === email)
}
```

- [ ] **Step 3: Create itinerary.ts with all 11 days**

This file contains the full itinerary extracted from the PDF. Each day has schedule, routes, documents, stages, and tips. The file is large but static — it's the core data of the app.

Create `src/data/itinerary.ts` with the complete `Day[]` array. All 11 days (J1 through J11) must be populated from the PDF content. Each day includes:
- `location` with real lat/lng coordinates for Open-Meteo
- `schedule` with times and descriptions from the PDF
- `routes` with Google Maps deep-links (format: `https://www.google.com/maps/dir/OriginAddress/DestinationAddress`)
- `documents` with links that will point to Google Drive (placeholder URLs to be filled by the user)
- `stages` listing the key stops for memory attachment
- `tips` from the PDF's "Conseils Pratiques" section

Example structure for J1 (all days follow the same pattern):

```typescript
import type { Day } from './types'

export const ITINERARY: Day[] = [
  {
    id: 'j1',
    number: 1,
    date: '2026-04-08',
    title: 'Arrivée à Montréal',
    subtitle: 'Vieux-Port, installation',
    distance: '25 km',
    duration: '0h30',
    location: { name: 'Montréal', lat: 45.5017, lng: -73.5673 },
    schedule: [
      { time: '11h00', label: 'Atterrissage · YUL', description: 'Navette 747 (10,25 CAD) ou taxi (~45 CAD) vers le centre-ville' },
      { time: '14h00', label: 'Vieux-Port de Montréal', description: 'Balade douce — rue de la Commune, place Jacques-Cartier. Pas de voiture J1–J2' },
      { time: 'Soir', label: 'Airbnb — 1677 Rue Saint-Denis', description: 'Hôte : Theatre By Lodgo · Studio Downtown Serenity · Check-in dès 16h · réf. HMBEHM4AH4' },
    ],
    routes: [],
    documents: [
      { icon: '🏨', label: 'Airbnb Downtown Serenity', detail: 'Réf. HMBEHM4AH4 · Check-in 16h', url: '' },
    ],
    stages: ['Aéroport YUL', 'Vieux-Port de Montréal', 'Airbnb Saint-Denis'],
    tips: ['Pas de voiture J1–J2 → économie parking ~30 CAD/nuit'],
  },
  // ... J2 through J11 — all populated from PDF
]

export function getDay(dayId: string): Day | undefined {
  return ITINERARY.find((d) => d.id === dayId)
}

export function getTodayDay(): Day | undefined {
  const today = new Date().toISOString().slice(0, 10)
  return ITINERARY.find((d) => d.date === today)
}
```

Populate ALL 11 days completely from the PDF data. Do not leave any day as a placeholder.

- [ ] **Step 4: Create infos.ts**

```typescript
import type { BudgetItem, Contact } from './types'

export const BUDGET_CATEGORIES = [
  {
    category: 'Vols',
    items: [
      { label: 'Bordeaux ↔ Montréal · Air Transat · 3 passagers', amount: '1 652 €', status: 'confirmed' as const },
    ],
  },
  {
    category: 'Hébergements',
    items: [
      { label: 'Airbnb Montréal (2 nuits)', amount: '175 €', status: 'confirmed' as const },
      { label: 'Ottawa Embassy Hotel (2 nuits)', amount: '233 €', status: 'confirmed' as const },
      { label: 'Petit Hôtel Krieghoff, Québec (3 nuits)', amount: '338 €', status: 'confirmed' as const },
      { label: 'Petit Manoir du Casino, La Malbaie (1 nuit)', amount: '129 €', status: 'confirmed' as const },
      { label: 'Gîte Maison Rochefort, Baie-Ste-Catherine (1 nuit)', amount: '136 €', status: 'confirmed' as const },
      { label: 'Dernière nuit Montréal', amount: '~120 €', status: 'estimated' as const },
    ],
  },
  {
    category: 'Activités',
    items: [
      { label: 'Parc Oméga — 3 billets', amount: '140 €', status: 'confirmed' as const },
      { label: 'Sucrerie de la Montagne — 3 personnes', amount: '180 €', status: 'confirmed' as const },
    ],
  },
]

export const BUDGET_TOTAL_CONFIRMED = '3 103 €'
export const BUDGET_EXTRA = 'Carburant ~150 € · repas ~300 € · dernière nuit ~120 €'

export const TRIP_STATS = {
  days: 11,
  nights: 10,
  km: '1 450',
  souvenirs: '∞',
}

export const CONTACTS: Contact[] = [
  { icon: '🚗', label: 'Agence location voiture', detail: 'Rue Stanley, Montréal' },
  { icon: '✈️', label: 'Air Transat', detail: 'Vol BOD ↔ YUL' },
  { icon: '🆘', label: 'Urgences Canada', detail: '911', phone: '911' },
]

export const GENERAL_TIPS = [
  '🥕 Parc Oméga : 2 grands sacs de carottes !',
  '🔭 Tadoussac : jumelles indispensables pour les bélugas',
  '🚗 Voiture one-way : retour à YUL, pas centre-ville',
  '⛰️ Chute Montmorency : escalier peut-être fermé en avril → télécabine',
  '🍁 Sucrerie : arriver vers 10h30 pour le service 11h30',
  '🐋 Bélugas mi-avril : observation gratuite depuis la rive !',
  '🛣️ Route 362 : la plus belle route de Charlevoix, belvédères à Cap-aux-Oies et Cap-à-l\'Aigle',
]
```

- [ ] **Step 5: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 6: Commit**

```bash
git add src/data/
git commit -m "feat: add types and static itinerary data for all 11 days"
```

---

## Task 2: Firebase setup & auth

**Files:**
- Create: `src/lib/firebase.ts`
- Create: `src/lib/auth.ts`
- Modify: `src/routes/__root.tsx` (add auth context)
- Create: `src/routes/login.tsx`
- Create: `firestore.rules`
- Create: `storage.rules`

- [ ] **Step 1: Create firebase.ts — app initialization**

```typescript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
```

- [ ] **Step 2: Create auth.ts — sign in/out + useAuth hook**

```typescript
import { useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from './firebase'
import { isEmailAllowed } from '#/data/family'

const provider = new GoogleAuthProvider()

export function signIn() {
  return signInWithPopup(auth, provider)
}

export function signOut() {
  return firebaseSignOut(auth)
}

type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: User }
  | { status: 'unauthenticated' }

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ status: 'loading' })

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!isEmailAllowed(user.email ?? '')) {
          await firebaseSignOut(auth)
          setState({ status: 'unauthenticated' })
          return
        }
        setState({ status: 'authenticated', user })
      } else {
        setState({ status: 'unauthenticated' })
      }
    })
  }, [])

  return state
}
```

- [ ] **Step 3: Update __root.tsx — add auth guard wrapping Outlet**

```tsx
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { ConfigProvider, theme, Spin } from 'antd'
import frFR from 'antd/locale/fr_FR'

import appCss from '../styles.css?url'
import { useAuth } from '#/lib/auth'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1',
      },
      { title: 'Carnet de Voyages — Canada 2026' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Create login.tsx**

```tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Typography, Space, message } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import { signIn } from '#/lib/auth'
import { isEmailAllowed } from '#/data/family'

const { Title, Text } = Typography

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()

  async function handleLogin() {
    try {
      const result = await signIn()
      if (!isEmailAllowed(result.user.email ?? '')) {
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
      <Space direction="vertical" align="center" size="large">
        <div style={{ fontSize: 48 }}>🍁</div>
        <Title level={2} style={{ color: '#e2e8f0', margin: 0 }}>
          La Boucle des Traditions
        </Title>
        <Text style={{ color: '#94a3b8', fontSize: 16 }}>
          Québec & Ontario · Avril 2026
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
```

- [ ] **Step 5: Create firestore.rules**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAllowedUser() {
      return request.auth != null &&
        request.auth.token.email in [
          'REPLACE_EMAIL_1',
          'REPLACE_EMAIL_2',
          'REPLACE_EMAIL_3'
        ];
    }

    match /memories/{memoryId} {
      allow read, write: if isAllowedUser();
    }
  }
}
```

- [ ] **Step 6: Create storage.rules**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAllowedUser() {
      return request.auth != null &&
        request.auth.token.email in [
          'REPLACE_EMAIL_1',
          'REPLACE_EMAIL_2',
          'REPLACE_EMAIL_3'
        ];
    }

    match /memories/{allPaths=**} {
      allow read, write: if isAllowedUser();
    }
  }
}
```

- [ ] **Step 7: Verify app starts with Firebase imports**

```bash
yarn dev
```

Expected: App runs. Login page renders at `/login`. No Firebase errors (config may show warnings if `.env.local` isn't filled yet, that's expected).

- [ ] **Step 8: Commit**

```bash
git add src/lib/firebase.ts src/lib/auth.ts src/routes/__root.tsx src/routes/login.tsx firestore.rules storage.rules
git commit -m "feat: add Firebase auth with Google sign-in and email whitelist"
```

---

## Task 3: Layout with bottom tabs & auth guard

**Files:**
- Create: `src/components/BottomTabs.tsx`
- Create: `src/routes/_app.tsx`
- Modify: `src/routes/index.tsx` → move to `src/routes/_app/index.tsx`
- Create: `src/routes/_app/souvenirs.tsx`
- Create: `src/routes/_app/infos.tsx`

- [ ] **Step 1: Create BottomTabs.tsx**

```tsx
import { useNavigate, useLocation } from '@tanstack/react-router'
import { CalendarOutlined, CameraOutlined, InfoCircleOutlined } from '@ant-design/icons'

const tabs = [
  { key: '/', label: 'Jours', icon: <CalendarOutlined /> },
  { key: '/souvenirs', label: 'Souvenirs', icon: <CameraOutlined /> },
  { key: '/infos', label: 'Infos', icon: <InfoCircleOutlined /> },
]

export default function BottomTabs() {
  const navigate = useNavigate()
  const location = useLocation()

  const activeKey = tabs.find((t) => location.pathname === t.key)?.key ?? '/'

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      borderTop: '1px solid #1e293b',
      background: '#0f172a',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 100,
    }}>
      {tabs.map((tab) => (
        <div
          key={tab.key}
          onClick={() => navigate({ to: tab.key })}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px 0',
            cursor: 'pointer',
            color: activeKey === tab.key ? '#6366f1' : '#64748b',
            fontSize: 20,
          }}
        >
          {tab.icon}
          <span style={{ fontSize: 10, marginTop: 2 }}>{tab.label}</span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create _app.tsx — authenticated layout**

```tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ConfigProvider, theme, Spin } from 'antd'
import frFR from 'antd/locale/fr_FR'
import BottomTabs from '#/components/BottomTabs'
import { useAuth } from '#/lib/auth'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  const authState = useAuth()

  if (authState.status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (authState.status === 'unauthenticated') {
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
      <div style={{
        minHeight: '100vh',
        background: '#0f172a',
        color: '#e2e8f0',
        paddingBottom: 72,
      }}>
        <Outlet />
      </div>
      <BottomTabs />
    </ConfigProvider>
  )
}
```

- [ ] **Step 3: Move index.tsx into _app/ and create placeholder souvenirs + infos routes**

Create `src/routes/_app/index.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: DayList,
})

function DayList() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Jours</h2>
      <p>Liste des jours — à venir</p>
    </div>
  )
}
```

Create `src/routes/_app/souvenirs.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/souvenirs')({
  component: SouvenirsPage,
})

function SouvenirsPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Souvenirs</h2>
      <p>Galerie — à venir</p>
    </div>
  )
}
```

Create `src/routes/_app/infos.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/infos')({
  component: InfosPage,
})

function InfosPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Infos</h2>
      <p>Infos pratiques — à venir</p>
    </div>
  )
}
```

Delete the old `src/routes/index.tsx`.

- [ ] **Step 4: Verify navigation works**

```bash
yarn dev
```

Expected: App redirects to `/login` if not authenticated. After login, shows the day list placeholder with bottom tabs. Tapping tabs switches between Jours/Souvenirs/Infos.

- [ ] **Step 5: Commit**

```bash
git add src/components/BottomTabs.tsx src/routes/_app.tsx src/routes/_app/ src/routes/login.tsx
git rm src/routes/index.tsx
git commit -m "feat: add authenticated layout with bottom tabs navigation"
```

---

## Task 4: Day list page (home)

**Files:**
- Modify: `src/routes/_app/index.tsx`

- [ ] **Step 1: Implement the day list page**

```tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, Tag, Typography } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { ITINERARY, getTodayDay } from '#/data/itinerary'

const { Title, Text } = Typography

export const Route = createFileRoute('/_app/')({
  component: DayList,
})

function DayList() {
  const todayDay = getTodayDay()

  return (
    <div style={{ padding: '16px 16px 0' }}>
      <div style={{ marginBottom: 16 }}>
        <Text style={{ color: '#6366f1', textTransform: 'uppercase', fontSize: 11, letterSpacing: 1 }}>
          8 – 18 avril 2026
        </Text>
        <Title level={3} style={{ color: '#e2e8f0', margin: '4px 0 0' }}>
          La Boucle des Traditions
        </Title>
        <Text style={{ color: '#94a3b8', fontSize: 13 }}>
          Québec & Ontario · 1 450 km
        </Text>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ITINERARY.map((day) => {
          const isToday = todayDay?.id === day.id
          return (
            <Link
              key={day.id}
              to="/jour/$dayId"
              params={{ dayId: day.id }}
              style={{ textDecoration: 'none' }}
            >
              <Card
                size="small"
                style={{
                  background: '#1e293b',
                  border: isToday ? '1.5px solid #6366f1' : '1px solid transparent',
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
                styles={{ body: { padding: '12px 14px' } }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    background: isToday ? '#6366f1' : '#334155',
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 13,
                    color: '#e2e8f0',
                    flexShrink: 0,
                  }}>
                    J{day.number}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
                      {day.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>
                      {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                      {day.distance !== '0 km' ? ` · ${day.distance}` : ' · à pied'}
                    </div>
                  </div>
                  <div style={{ color: isToday ? '#6366f1' : '#94a3b8', fontSize: 11, flexShrink: 0 }}>
                    {isToday ? 'Auj. ' : ''}<RightOutlined />
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify the day list renders**

```bash
yarn dev
```

Expected: Home page shows all 11 days as cards. Today's day (if during the trip) is highlighted. Cards are tappable (link to `/jour/$dayId` which will 404 for now — that's expected).

- [ ] **Step 3: Commit**

```bash
git add src/routes/_app/index.tsx
git commit -m "feat: add day list home page with today highlight"
```

---

## Task 5: Weather integration

**Files:**
- Create: `src/lib/weather.ts`
- Create: `src/components/WeatherWidget.tsx`

- [ ] **Step 1: Create weather.ts — Open-Meteo fetch + TanStack Query hook**

```typescript
import { useQuery } from '@tanstack/react-query'

type WeatherData = {
  temperatureMax: number
  temperatureMin: number
  temperatureMean: number
  precipitationProbability: number
  windSpeed: number
  weatherCode: number
}

const WEATHER_CODES: Record<number, { icon: string; label: string }> = {
  0: { icon: '☀️', label: 'Ensoleillé' },
  1: { icon: '🌤️', label: 'Peu nuageux' },
  2: { icon: '⛅', label: 'Partiellement nuageux' },
  3: { icon: '☁️', label: 'Nuageux' },
  45: { icon: '🌫️', label: 'Brouillard' },
  48: { icon: '🌫️', label: 'Brouillard givrant' },
  51: { icon: '🌦️', label: 'Bruine légère' },
  53: { icon: '🌦️', label: 'Bruine' },
  55: { icon: '🌧️', label: 'Bruine dense' },
  61: { icon: '🌧️', label: 'Pluie légère' },
  63: { icon: '🌧️', label: 'Pluie' },
  65: { icon: '🌧️', label: 'Forte pluie' },
  71: { icon: '🌨️', label: 'Neige légère' },
  73: { icon: '🌨️', label: 'Neige' },
  75: { icon: '❄️', label: 'Forte neige' },
  80: { icon: '🌦️', label: 'Averses' },
  81: { icon: '🌧️', label: 'Averses modérées' },
  82: { icon: '🌧️', label: 'Fortes averses' },
  85: { icon: '🌨️', label: 'Averses de neige' },
  86: { icon: '🌨️', label: 'Fortes averses de neige' },
  95: { icon: '⛈️', label: 'Orage' },
  96: { icon: '⛈️', label: 'Orage avec grêle' },
  99: { icon: '⛈️', label: 'Orage violent' },
}

export function getWeatherDisplay(code: number) {
  return WEATHER_CODES[code] ?? { icon: '🌡️', label: 'Inconnu' }
}

async function fetchWeather(lat: number, lng: number, date: string): Promise<WeatherData | null> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_probability_max,wind_speed_10m_max,weather_code&start_date=${date}&end_date=${date}&timezone=America/Toronto`

  const res = await fetch(url)
  if (!res.ok) return null

  const data = await res.json()
  const daily = data.daily
  if (!daily || !daily.time?.length) return null

  return {
    temperatureMax: daily.temperature_2m_max[0],
    temperatureMin: daily.temperature_2m_min[0],
    temperatureMean: daily.temperature_2m_mean[0],
    precipitationProbability: daily.precipitation_probability_max[0],
    windSpeed: daily.wind_speed_10m_max[0],
    weatherCode: daily.weather_code[0],
  }
}

export function useWeather(lat: number, lng: number, date: string) {
  return useQuery({
    queryKey: ['weather', lat, lng, date],
    queryFn: () => fetchWeather(lat, lng, date),
    staleTime: 3 * 60 * 60 * 1000, // 3 hours
    retry: 1,
  })
}
```

- [ ] **Step 2: Create WeatherWidget.tsx**

```tsx
import { Spin } from 'antd'
import { useWeather, getWeatherDisplay } from '#/lib/weather'

type Props = {
  lat: number
  lng: number
  date: string
}

export default function WeatherWidget({ lat, lng, date }: Props) {
  const { data, isLoading, error } = useWeather(lat, lng, date)

  if (isLoading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #1e293b)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
        <Spin />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ background: '#1e293b', borderRadius: 12, padding: '14px 16px', color: '#64748b', fontSize: 13 }}>
        Météo indisponible
      </div>
    )
  }

  const display = getWeatherDisplay(data.weatherCode)

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3a5f, #1e293b)',
      borderRadius: 12,
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}>
      <div style={{ fontSize: 36 }}>{display.icon}</div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#e2e8f0' }}>
          {Math.round(data.temperatureMean)}°C
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>
          {display.label} · Vent {Math.round(data.windSpeed)} km/h
        </div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
          Min {Math.round(data.temperatureMin)}° · Max {Math.round(data.temperatureMax)}° · 💧 {data.precipitationProbability}%
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify weather compiles**

```bash
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/weather.ts src/components/WeatherWidget.tsx
git commit -m "feat: add Open-Meteo weather integration with forecast widget"
```

---

## Task 6: Day detail page

**Files:**
- Create: `src/routes/jour/$dayId.tsx`

- [ ] **Step 1: Create the day detail page**

```tsx
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button, Typography, Card, Empty } from 'antd'
import {
  LeftOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  PictureOutlined,
} from '@ant-design/icons'
import { getDay } from '#/data/itinerary'
import WeatherWidget from '#/components/WeatherWidget'
import { useMemoriesByDay } from '#/lib/memories'

const { Title, Text } = Typography

export const Route = createFileRoute('/jour/$dayId')({
  component: DayDetail,
})

function DayDetail() {
  const { dayId } = Route.useParams()
  const navigate = useNavigate()
  const day = getDay(dayId)
  const { data: memories = [] } = useMemoriesByDay(dayId)

  if (!day) {
    return <Empty description="Jour introuvable" style={{ marginTop: 80 }} />
  }

  const memoriesByStage = day.stages.reduce<Record<string, typeof memories>>((acc, stage) => {
    acc[stage] = memories.filter((m) => m.stageLabel === stage)
    return acc
  }, {})

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <LeftOutlined onClick={() => navigate({ to: '/' })} style={{ fontSize: 16, color: '#94a3b8', cursor: 'pointer' }} />
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ color: '#e2e8f0', margin: 0 }}>
            J{day.number} · {day.title}
          </Title>
          <Text style={{ color: '#94a3b8', fontSize: 12 }}>
            {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            {day.distance !== '0 km' ? ` · ${day.distance}` : ''}
          </Text>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Weather */}
        <WeatherWidget lat={day.location.lat} lng={day.location.lng} date={day.date} />

        {/* Schedule */}
        {day.schedule.length > 0 && (
          <Card size="small" style={{ background: '#1e293b', border: 'none', borderRadius: 12 }} styles={{ body: { padding: '14px 16px' } }}>
            <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              Programme
            </div>
            {day.schedule.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < day.schedule.length - 1 ? 10 : 0 }}>
                <div style={{ fontSize: 11, color: '#94a3b8', minWidth: 42, flexShrink: 0 }}>{item.time}</div>
                <div>
                  <div style={{ fontSize: 13, color: '#e2e8f0' }}>{item.label}</div>
                  {item.description && (
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{item.description}</div>
                  )}
                </div>
              </div>
            ))}
          </Card>
        )}

        {/* Routes */}
        {day.routes.length > 0 && (
          <Card size="small" style={{ background: '#1e293b', border: 'none', borderRadius: 12 }} styles={{ body: { padding: '14px 16px' } }}>
            <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              Itinéraires
            </div>
            {day.routes.map((route, i) => (
              <a
                key={i}
                href={route.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  background: '#334155',
                  borderRadius: 8,
                  marginBottom: i < day.routes.length - 1 ? 6 : 0,
                }}>
                  <EnvironmentOutlined style={{ fontSize: 16, color: '#6366f1' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>
                      {route.from} → {route.to}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{route.distance} · {route.duration}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#6366f1' }}>Maps ↗</div>
                </div>
              </a>
            ))}
          </Card>
        )}

        {/* Documents */}
        {day.documents.length > 0 && (
          <Card size="small" style={{ background: '#1e293b', border: 'none', borderRadius: 12 }} styles={{ body: { padding: '14px 16px' } }}>
            <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              Documents
            </div>
            {day.documents.map((doc, i) => (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  background: '#334155',
                  borderRadius: 8,
                  marginBottom: i < day.documents.length - 1 ? 6 : 0,
                }}>
                  <span style={{ fontSize: 16 }}>{doc.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>{doc.label}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{doc.detail}</div>
                  </div>
                  <FileTextOutlined style={{ color: '#6366f1' }} />
                </div>
              </a>
            ))}
          </Card>
        )}

        {/* Memories */}
        <Card size="small" style={{ background: '#1e293b', border: 'none', borderRadius: 12 }} styles={{ body: { padding: '14px 16px' } }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Nos souvenirs
            </div>
            <Link to="/jour/$dayId/souvenir/nouveau" params={{ dayId }}>
              <Button type="primary" size="small" icon={<PlusOutlined />}>
                Ajouter
              </Button>
            </Link>
          </div>

          {memories.length === 0 ? (
            <Text style={{ color: '#64748b', fontSize: 13 }}>Aucun souvenir pour ce jour</Text>
          ) : (
            day.stages.map((stage) => {
              const stageMemories = memoriesByStage[stage] ?? []
              if (stageMemories.length === 0) return null
              return (
                <div key={stage} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 6 }}>{stage}</div>
                  {stageMemories.map((memory) => (
                    <div key={memory.id} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                        {memory.media.map((item, i) => (
                          <div key={i} style={{
                            width: 64,
                            height: 64,
                            borderRadius: 8,
                            overflow: 'hidden',
                            background: '#334155',
                            position: 'relative',
                          }}>
                            <img
                              src={item.thumbnailUrl}
                              alt=""
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {item.type === 'video' && (
                              <PlayCircleOutlined style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: 20,
                                color: 'white',
                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                              }} />
                            )}
                          </div>
                        ))}
                      </div>
                      {memory.description && (
                        <div style={{ fontSize: 12, color: '#cbd5e1', fontStyle: 'italic', padding: 8, background: '#0f172a', borderRadius: 6 }}>
                          "{memory.description}"
                        </div>
                      )}
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>— {memory.authorName}</div>
                    </div>
                  ))}
                </div>
              )
            })
          )}
        </Card>
      </div>
    </div>
  )
}
```

Note: This references `useMemoriesByDay` from `src/lib/memories.ts` which will be created in Task 7. For now, this file can be created as a stub. The complete implementation comes in Task 7.

- [ ] **Step 2: Create stub memories.ts so the page compiles**

```typescript
import { useQuery } from '@tanstack/react-query'
import type { Memory } from '#/data/types'

export function useMemoriesByDay(dayId: string) {
  return useQuery<Memory[]>({
    queryKey: ['memories', dayId],
    queryFn: async () => {
      // Stub — will be replaced with Firestore query in Task 7
      return []
    },
  })
}
```

- [ ] **Step 3: Verify the day detail page renders**

```bash
yarn dev
```

Expected: Navigate to a day from the list. The detail page shows: header with back button, weather widget (loading then showing data), schedule, routes with Maps links, documents with links, empty memories section with "Ajouter" button.

- [ ] **Step 4: Commit**

```bash
git add src/routes/jour/ src/lib/memories.ts
git commit -m "feat: add day detail page with weather, routes, documents, and memories sections"
```

---

## Task 7: Firestore memories + storage upload

**Files:**
- Modify: `src/lib/memories.ts` (replace stub with real Firestore)
- Create: `src/lib/storage.ts`
- Create: `src/lib/media-utils.ts`

- [ ] **Step 1: Implement media-utils.ts — compression, thumbnail, video poster**

```typescript
import imageCompression from 'browser-image-compression'

export async function compressImage(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
  })
}

export async function generateThumbnail(file: File): Promise<Blob> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.08,
    maxWidthOrHeight: 200,
    useWebWorker: true,
  })
  return compressed
}

export function captureVideoPoster(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const url = URL.createObjectURL(file)

    video.preload = 'metadata'
    video.muted = true
    video.src = url

    video.onloadeddata = () => {
      video.currentTime = 0.5
    }

    video.onseeked = () => {
      canvas.width = Math.min(video.videoWidth, 200)
      canvas.height = Math.round(canvas.width * (video.videoHeight / video.videoWidth))
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (blob) resolve(blob)
          else reject(new Error('Failed to capture video poster'))
        },
        'image/jpeg',
        0.7,
      )
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load video'))
    }
  })
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/')
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}
```

- [ ] **Step 2: Implement storage.ts — Firebase Storage upload**

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'
import { compressImage, generateThumbnail, captureVideoPoster, isVideoFile } from './media-utils'

type UploadResult = {
  filename: string
  type: 'photo' | 'video'
  originalUrl: string
  thumbnailUrl: string
  size: number
}

export async function uploadMedia(
  memoryId: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  const isVideo = isVideoFile(file)
  const type = isVideo ? 'video' : 'photo'

  // Compress image or keep video as-is
  const processedFile = isVideo ? file : await compressImage(file)

  // Generate thumbnail
  const thumbnailBlob = isVideo
    ? await captureVideoPoster(file)
    : await generateThumbnail(file)

  // Upload original
  const originalRef = ref(storage, `memories/${memoryId}/original/${file.name}`)
  await uploadBytes(originalRef, processedFile)
  const originalUrl = await getDownloadURL(originalRef)

  // Upload thumbnail
  const thumbName = file.name.replace(/\.[^.]+$/, '.jpg')
  const thumbnailRef = ref(storage, `memories/${memoryId}/thumbnail/${thumbName}`)
  await uploadBytes(thumbnailRef, thumbnailBlob, { contentType: 'image/jpeg' })
  const thumbnailUrl = await getDownloadURL(thumbnailRef)

  return {
    filename: file.name,
    type,
    originalUrl,
    thumbnailUrl,
    size: processedFile.size,
  }
}
```

- [ ] **Step 3: Implement memories.ts — Firestore CRUD with real queries**

```typescript
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { db } from './firebase'
import type { Memory, MediaItem } from '#/data/types'

const memoriesRef = collection(db, 'memories')

export function useMemoriesByDay(dayId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const q = query(memoriesRef, where('dayId', '==', dayId), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Memory[]
      queryClient.setQueryData(['memories', dayId], memories)
    })
    return unsubscribe
  }, [dayId, queryClient])

  return useQuery<Memory[]>({
    queryKey: ['memories', dayId],
    queryFn: () => [],
    staleTime: Infinity,
  })
}

export function useAllMemories() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const q = query(memoriesRef, orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Memory[]
      queryClient.setQueryData(['memories', 'all'], memories)
    })
    return unsubscribe
  }, [queryClient])

  return useQuery<Memory[]>({
    queryKey: ['memories', 'all'],
    queryFn: () => [],
    staleTime: Infinity,
  })
}

type CreateMemoryInput = {
  dayId: string
  stageLabel: string
  description: string
  authorEmail: string
  authorName: string
  media: MediaItem[]
}

export function useCreateMemory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateMemoryInput) => {
      const docRef = await addDoc(memoriesRef, {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['memories', variables.dayId] })
      queryClient.invalidateQueries({ queryKey: ['memories', 'all'] })
    },
  })
}
```

- [ ] **Step 4: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/memories.ts src/lib/storage.ts src/lib/media-utils.ts
git commit -m "feat: add Firestore memories, Firebase Storage upload with thumbnails"
```

---

## Task 8: Add memory page

**Files:**
- Create: `src/components/MediaUpload.tsx`
- Create: `src/routes/jour_.$dayId.souvenir.nouveau.tsx`

- [ ] **Step 1: Create MediaUpload.tsx**

```tsx
import { useState, useRef } from 'react'
import { Button } from 'antd'
import { PlusOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { isVideoFile } from '#/lib/media-utils'

type Props = {
  files: File[]
  onChange: (files: File[]) => void
}

export default function MediaUpload({ files, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<Map<string, string>>(new Map())

  function handleAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files ?? [])
    const updated = [...files, ...newFiles]
    onChange(updated)

    newFiles.forEach((file) => {
      if (!isVideoFile(file)) {
        const url = URL.createObjectURL(file)
        setPreviews((prev) => new Map(prev).set(file.name + file.size, url))
      }
    })

    if (inputRef.current) inputRef.current.value = ''
  }

  function handleRemove(index: number) {
    const file = files[index]
    const key = file.name + file.size
    const url = previews.get(key)
    if (url) URL.revokeObjectURL(url)
    setPreviews((prev) => {
      const next = new Map(prev)
      next.delete(key)
      return next
    })
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleAdd}
        style={{ display: 'none' }}
      />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {files.map((file, i) => {
          const isVideo = isVideoFile(file)
          const key = file.name + file.size
          return (
            <div key={key} style={{
              width: 90,
              height: 90,
              borderRadius: 10,
              overflow: 'hidden',
              background: '#334155',
              position: 'relative',
            }}>
              {isVideo ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <PlayCircleOutlined style={{ fontSize: 24, color: '#94a3b8' }} />
                  <div style={{ fontSize: 9, color: '#64748b', marginTop: 4, padding: '0 4px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{file.name}</div>
                </div>
              ) : (
                <img src={previews.get(key)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <div
                onClick={() => handleRemove(i)}
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                <DeleteOutlined style={{ fontSize: 10, color: 'white' }} />
              </div>
            </div>
          )
        })}
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            width: 90,
            height: 90,
            border: '2px dashed #334155',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <PlusOutlined style={{ fontSize: 24, color: '#6366f1' }} />
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Ajouter</div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create the add memory page**

```tsx
import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Input, message, Progress } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { getDay } from '#/data/itinerary'
import { FAMILY_MEMBERS } from '#/data/family'
import { useAuth } from '#/lib/auth'
import { useCreateMemory } from '#/lib/memories'
import { uploadMedia } from '#/lib/storage'
import MediaUpload from '#/components/MediaUpload'
import type { MediaItem } from '#/data/types'

export const Route = createFileRoute('/jour_/$dayId/souvenir/nouveau')({
  component: AddMemory,
})

function AddMemory() {
  const { dayId } = Route.useParams()
  const navigate = useNavigate()
  const authState = useAuth()
  const day = getDay(dayId)
  const createMemory = useCreateMemory()

  const [selectedStage, setSelectedStage] = useState<string>(day?.stages[0] ?? '')
  const [files, setFiles] = useState<File[]>([])
  const [description, setDescription] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState(() => {
    if (authState.status === 'authenticated') {
      const member = FAMILY_MEMBERS.find((m) => m.email === authState.user.email)
      return member ?? FAMILY_MEMBERS[0]
    }
    return FAMILY_MEMBERS[0]
  })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  if (!day) return null

  async function handlePublish() {
    if (files.length === 0 && !description.trim()) {
      message.warning('Ajoutez au moins une photo/vidéo ou une description')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Create a temporary doc ID for storage path
      const tempId = `${dayId}-${Date.now()}`

      // Upload all media
      const mediaItems: MediaItem[] = []
      for (let i = 0; i < files.length; i++) {
        const result = await uploadMedia(tempId, files[i])
        mediaItems.push(result)
        setUploadProgress(Math.round(((i + 1) / files.length) * 100))
      }

      await createMemory.mutateAsync({
        dayId,
        stageLabel: selectedStage,
        description: description.trim(),
        authorEmail: selectedAuthor.email,
        authorName: selectedAuthor.name,
        media: mediaItems,
      })

      message.success('Souvenir ajouté !')
      navigate({ to: '/jour/$dayId', params: { dayId } })
    } catch {
      message.error('Erreur lors de l\'envoi. Réessayez.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => navigate({ to: '/jour/$dayId', params: { dayId } })} style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer' }}>
          <LeftOutlined /> Retour
        </div>
        <div style={{ fontSize: 17, fontWeight: 700 }}>Nouveau souvenir</div>
        <Button
          type="primary"
          size="small"
          onClick={handlePublish}
          loading={uploading}
        >
          Publier
        </Button>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Stage selection */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
            Rattacher à · J{day.number}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {day.stages.map((stage) => (
              <div
                key={stage}
                onClick={() => setSelectedStage(stage)}
                style={{
                  background: selectedStage === stage ? '#6366f1' : '#334155',
                  color: selectedStage === stage ? 'white' : '#94a3b8',
                  fontSize: 12,
                  padding: '6px 14px',
                  borderRadius: 20,
                  cursor: 'pointer',
                }}
              >
                {stage}
              </div>
            ))}
          </div>
        </div>

        {/* Media upload */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
            Photos & vidéos
          </div>
          <MediaUpload files={files} onChange={setFiles} />
        </div>

        {/* Description */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
            Description
          </div>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Racontez ce moment..."
            autoSize={{ minRows: 3 }}
            style={{ background: '#0f172a', border: 'none', color: '#e2e8f0' }}
          />
        </div>

        {/* Author selection */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
            Auteur
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {FAMILY_MEMBERS.map((member) => (
              <div
                key={member.email}
                onClick={() => setSelectedAuthor(member)}
                style={{
                  background: selectedAuthor.email === member.email ? '#6366f1' : '#334155',
                  color: selectedAuthor.email === member.email ? 'white' : '#94a3b8',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {member.initial}
              </div>
            ))}
          </div>
        </div>

        {/* Upload progress */}
        {uploading && (
          <Progress percent={uploadProgress} status="active" strokeColor="#6366f1" />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify the add memory page renders**

```bash
yarn dev
```

Expected: Navigate from a day detail → "Ajouter" button → add memory form. Stage chips, media upload, description, author selection all render. Publishing uploads to Firebase and redirects back.

- [ ] **Step 4: Commit**

```bash
git add src/components/MediaUpload.tsx src/routes/jour_.\$dayId.souvenir.nouveau.tsx
git commit -m "feat: add memory creation page with media upload and author selection"
```

---

## Task 9: Souvenirs gallery page

**Files:**
- Modify: `src/routes/_app/souvenirs.tsx`

- [ ] **Step 1: Implement the global souvenirs gallery**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Typography, Empty, Spin, Image } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import { useAllMemories } from '#/lib/memories'
import { ITINERARY } from '#/data/itinerary'
import type { Memory } from '#/data/types'

const { Title, Text } = Typography

export const Route = createFileRoute('/_app/souvenirs')({
  component: SouvenirsPage,
})

function SouvenirsPage() {
  const { data: memories = [], isLoading } = useAllMemories()

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    )
  }

  // Group memories by dayId
  const memoriesByDay = memories.reduce<Record<string, Memory[]>>((acc, m) => {
    if (!acc[m.dayId]) acc[m.dayId] = []
    acc[m.dayId].push(m)
    return acc
  }, {})

  const daysWithMemories = ITINERARY.filter((day) => (memoriesByDay[day.id]?.length ?? 0) > 0)

  return (
    <div style={{ padding: '16px 16px 0' }}>
      <Title level={3} style={{ color: '#e2e8f0', margin: '0 0 16px' }}>
        Nos souvenirs
      </Title>

      {daysWithMemories.length === 0 ? (
        <Empty
          description={<Text style={{ color: '#64748b' }}>Aucun souvenir pour le moment</Text>}
          style={{ marginTop: 40 }}
        />
      ) : (
        daysWithMemories.map((day) => (
          <div key={day.id} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
              J{day.number} · {day.title}
            </div>
            {memoriesByDay[day.id].map((memory) => (
              <div key={memory.id} style={{ background: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>{memory.stageLabel}</div>
                {memory.media.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                    <Image.PreviewGroup>
                      {memory.media.map((item, i) => (
                        <div key={i} style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                          {item.type === 'video' ? (
                            <a href={item.originalUrl} target="_blank" rel="noopener noreferrer">
                              <img src={item.thumbnailUrl} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <PlayCircleOutlined style={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: 24, color: 'white',
                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                              }} />
                            </a>
                          ) : (
                            <Image
                              src={item.thumbnailUrl}
                              preview={{ src: item.originalUrl }}
                              alt=""
                              loading="lazy"
                              style={{ width: 80, height: 80, objectFit: 'cover' }}
                            />
                          )}
                        </div>
                      ))}
                    </Image.PreviewGroup>
                  </div>
                )}
                {memory.description && (
                  <div style={{ fontSize: 12, color: '#cbd5e1', fontStyle: 'italic' }}>
                    "{memory.description}"
                  </div>
                )}
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>— {memory.authorName}</div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify souvenirs page renders**

```bash
yarn dev
```

Expected: Souvenirs tab shows "Aucun souvenir" when empty, or groups memories by day with thumbnail gallery when populated. Tapping a photo thumbnail opens full-size preview (Ant Design Image). Tapping a video thumbnail opens the video URL.

- [ ] **Step 3: Commit**

```bash
git add src/routes/_app/souvenirs.tsx
git commit -m "feat: add global souvenirs gallery grouped by day with image preview"
```

---

## Task 10: Infos page

**Files:**
- Modify: `src/routes/_app/infos.tsx`

- [ ] **Step 1: Implement the infos page**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Card, Typography } from 'antd'
import { PhoneOutlined } from '@ant-design/icons'
import {
  BUDGET_CATEGORIES,
  BUDGET_TOTAL_CONFIRMED,
  BUDGET_EXTRA,
  TRIP_STATS,
  CONTACTS,
  GENERAL_TIPS,
} from '#/data/infos'

const { Title, Text } = Typography

export const Route = createFileRoute('/_app/infos')({
  component: InfosPage,
})

function InfosPage() {
  return (
    <div style={{ padding: '16px 16px 0' }}>
      <Title level={3} style={{ color: '#e2e8f0', margin: '0 0 16px' }}>
        Infos pratiques
      </Title>

      {/* Budget */}
      <Card size="small" style={{ background: '#1e293b', border: 'none', borderRadius: 12, marginBottom: 10 }} styles={{ body: { padding: '14px 16px' } }}>
        <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          Budget
        </div>
        {BUDGET_CATEGORIES.map((cat) => (
          <div key={cat.category}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginBottom: 4, marginTop: 8 }}>{cat.category}</div>
            {cat.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 13, color: '#e2e8f0' }}>{item.label}</Text>
                <Text style={{ fontSize: 13, color: item.status === 'confirmed' ? '#94a3b8' : '#f59e0b' }}>{item.amount}</Text>
              </div>
            ))}
          </div>
        ))}
        <div style={{ borderTop: '1px solid #334155', marginTop: 12, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Total confirmé</Text>
          <Text style={{ fontSize: 14, fontWeight: 600, color: '#6366f1' }}>{BUDGET_TOTAL_CONFIRMED}</Text>
        </div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>{BUDGET_EXTRA}</div>
      </Card>

      {/* Trip stats */}
      <Card size="small" style={{ background: '#1e293b', border: 'none', borderRadius: 12, marginBottom: 10 }} styles={{ body: { padding: '14px 16px' } }}>
        <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          Le voyage en chiffres
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { value: TRIP_STATS.days, label: 'jours' },
            { value: TRIP_STATS.km, label: 'km' },
            { value: TRIP_STATS.nights, label: 'nuits' },
            { value: TRIP_STATS.souvenirs, label: 'souvenirs' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#0f172a', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0' }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Contacts */}
      <Card size="small" style={{ background: '#1e293b', border: 'none', borderRadius: 12, marginBottom: 10 }} styles={{ body: { padding: '14px 16px' } }}>
        <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          Contacts utiles
        </div>
        {CONTACTS.map((contact, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 0',
            borderBottom: i < CONTACTS.length - 1 ? '1px solid #334155' : 'none',
          }}>
            <span style={{ fontSize: 16 }}>{contact.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#e2e8f0' }}>{contact.label}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{contact.detail}</div>
            </div>
            {contact.phone && (
              <a href={`tel:${contact.phone}`} style={{ color: '#6366f1', fontSize: 11 }}>
                <PhoneOutlined /> Appeler
              </a>
            )}
          </div>
        ))}
      </Card>

      {/* Tips */}
      <Card size="small" style={{ background: '#1e293b', border: 'none', borderRadius: 12, marginBottom: 10 }} styles={{ body: { padding: '14px 16px' } }}>
        <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
          Conseils & rappels
        </div>
        <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
          {GENERAL_TIPS.map((tip, i) => (
            <div key={i} style={{ marginBottom: i < GENERAL_TIPS.length - 1 ? 6 : 0 }}>{tip}</div>
          ))}
        </div>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Verify infos page renders**

```bash
yarn dev
```

Expected: Infos tab shows budget breakdown, trip stats grid, contacts with call links, and tips list.

- [ ] **Step 3: Commit**

```bash
git add src/routes/_app/infos.tsx
git commit -m "feat: add infos page with budget, contacts, and travel tips"
```

---

## Task 11: Final integration & polish

**Files:**
- Modify: `src/routes/__root.tsx` (add ConfigProvider for login page too)
- Modify: `.gitignore` (add .superpowers/)
- Modify: `AGENTS.md` (update with new architecture)

- [ ] **Step 1: Update __root.tsx to wrap everything in Ant Design ConfigProvider**

The current setup has ConfigProvider only in `_app.tsx`. The login page also needs it for Ant Design components to render correctly with dark theme.

```tsx
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { ConfigProvider, theme } from 'antd'
import frFR from 'antd/locale/fr_FR'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1',
      },
      { title: 'Carnet de Voyages — Canada 2026' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
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
          {children}
        </ConfigProvider>
        <Scripts />
      </body>
    </html>
  )
}
```

Then remove the duplicate `ConfigProvider` from `_app.tsx` — keep only the layout structure.

- [ ] **Step 2: Add .superpowers/ to .gitignore**

Append to `.gitignore`:

```
.superpowers/
```

- [ ] **Step 3: Update AGENTS.md with new architecture**

Update `AGENTS.md` to reflect the new stack: Ant Design instead of Tailwind, Firebase for backend, file structure, and key conventions.

- [ ] **Step 4: Full verification**

```bash
yarn dev
```

Test the complete flow:
1. Open app → redirected to login
2. Login with Google → redirected to day list
3. Tap a day → day detail with weather, schedule, routes, documents
4. Tap "Ajouter" → add memory form with stage selection, media upload, description, author
5. Publish a memory → appears in day detail and souvenirs gallery
6. Switch tabs → Jours, Souvenirs, Infos all work
7. Infos page shows budget, stats, contacts, tips

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: final integration polish and documentation update"
```

---

## Summary

| Task | Description | Key files |
|------|-------------|-----------|
| 0 | Clean demo, install deps | package.json, vite.config.ts, __root.tsx |
| 1 | Types & static data (11 days) | src/data/*.ts |
| 2 | Firebase setup & auth | src/lib/firebase.ts, auth.ts, login.tsx, *.rules |
| 3 | Layout with bottom tabs | BottomTabs.tsx, _app.tsx, route files |
| 4 | Day list page | _app/index.tsx |
| 5 | Weather integration | lib/weather.ts, WeatherWidget.tsx |
| 6 | Day detail page | jour/$dayId.tsx |
| 7 | Firestore memories + storage | lib/memories.ts, storage.ts, media-utils.ts |
| 8 | Add memory page | MediaUpload.tsx, souvenir form |
| 9 | Souvenirs gallery | _app/souvenirs.tsx |
| 10 | Infos page | _app/infos.tsx |
| 11 | Final integration & polish | __root.tsx, AGENTS.md |
