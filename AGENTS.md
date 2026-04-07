# AGENTS.md

This file provides guidance to AI coding agents working with code in this repository.

## Project Overview

Carnet Voyages — a travel journal app for a Canada 2026 trip. Built with TanStack Start (React SSR framework), using file-based routing, TanStack Query for data fetching, Ant Design for UI components, and Firebase for backend services.

## Commands

- **Dev server:** `yarn dev` (runs on port 3000, loads `.env.local`)
- **Build:** `yarn vite build`
- **Start production:** `yarn start`
- **Run all tests:** `yarn test` (Vitest)
- **Run single test:** `yarn vitest run path/to/test.ts`
- **Lint:** `yarn lint` (ESLint with TanStack config)
- **Format check:** `yarn format` (Prettier)
- **Auto-fix lint + format:** `yarn check`
- **Type check:** `npx tsc --noEmit`

## Architecture

- **Framework:** TanStack Start (Vite-based React SSR with server functions via `createServerFn`)
- **Routing:** File-based routing in `src/routes/`. Route tree is auto-generated in `src/routeTree.gen.ts`. Root layout is in `src/routes/__root.tsx`.
- **Data fetching:** TanStack Query integrated with router SSR via `setupRouterSsrQueryIntegration` in `src/router.tsx`. Router context provides `QueryClient`.
- **UI Components:** Ant Design (antd) with dark theme. ConfigProvider is in `__root.tsx` with `frFR` locale.
- **Styling:** Ant Design component library with inline styles. Global styles in `src/styles.css`.
- **Backend:** Firebase (Auth, Firestore, Storage) configured in `src/lib/firebase.ts`.
- **Auth:** Firebase Authentication with Google sign-in. Auth state managed via `src/lib/auth.ts`.
- **Database:** Cloud Firestore for trip days, memories, and souvenirs. Data layer in `src/data/`.
- **Storage:** Firebase Storage for photo uploads.
- **Path aliases:** `#/*` and `@/*` both resolve to `./src/*` (tsconfig paths + package.json imports).
- **Testing:** Vitest with jsdom, React Testing Library available.

## Key Directories

- `src/routes/` — File-based route components (pages)
- `src/data/` — Firestore data access layer (queries, mutations)
- `src/lib/` — Shared utilities (Firebase config, auth, types)
- `src/components/` — Reusable UI components (BottomTabs, etc.)
- `src/integrations/` — TanStack Query provider setup

## Code Style

- No semicolons, single quotes, trailing commas (Prettier config)
- ESLint uses `@tanstack/eslint-config` with relaxed rules for import ordering and `require-await`
- TypeScript strict mode enabled
- Files prefixed with `demo` are scaffolding examples and can be deleted

## Sentry

Sentry is used for error tracking and instrumentation. DSN is configured via `VITE_SENTRY_DSN` in `.env.local`. Server instrumentation is in `instrument.server.mjs`.

### Error Collection

Error collection is automatic and configured in `src/router.tsx`.

### Instrumenting Server Functions

All server functions (`createServerFn`) should be instrumented with Sentry spans:

```tsx
import * as Sentry from '@sentry/tanstackstart-react'

Sentry.startSpan({ name: 'Requesting all the pokemon' }, async () => {
  await fetch('https://api.pokemon.com/data/')
})
```

## Git Workflow

- Never commit directly to `main`. Always create a feature branch.
- Branch naming: `feat/short-description`, `fix/short-description`, `chore/short-description`
- All changes reach `main` via pull requests.
- CI must pass before merging. The author reviews and merges.
