# Unit Tests — Design Spec

**Date:** 2026-04-07
**Objective:** Achieve 80%+ coverage on `src/lib/` and `src/data/` with meaningful unit tests.
**PR:** Separate from any existing feature work. Branch from updated `origin/main`.

## Scope

Target: `src/lib/` and `src/data/` only (business logic, pure functions, static data).

Excluded:
- React hooks (`useAuth`, `useMemoriesByDay`, `useAllMemories`, `useMemoriesCount`, `useFamilyMembers`, `useFamilyMember`, `useWeather`)
- DOM-heavy functions (`compressImage`, `generateThumbnail`, `captureVideoPoster`)
- Firebase init (`firebase.ts`)
- Upload pipeline (`storage.ts`)
- Components (`src/components/`)
- Routes (`src/routes/`)

## Mocking Strategy

- **Firebase:** Mock at our internal layer — `vi.mock('#/lib/firebase')` to stub `getFirebaseDb()`, `getFirebaseAuth()`. No direct mocking of `firebase/*` SDK modules.
- **Fetch API:** `vi.stubGlobal('fetch', ...)` for `fetchWeather`.
- **Date:** `vi.useFakeTimers()` / `vi.setSystemTime()` for `getTodayDay`.
- **Firebase User:** Plain object matching the `User` interface with a mocked `getIdTokenResult()`.
- **Firestore `getDocs`:** Mock at `firebase/firestore` level for `fetchFamilyMembers` (the function is pure async, not a hook).

## Test Files

All tests co-located next to their source file (`module.test.ts`).

### `src/lib/weather.test.ts` (enrich existing)

- `getWeatherDisplay(0)` → `{ icon: '...', label: 'Ensoleill...' }` (already covered)
- `fetchWeather` — mock `global.fetch`:
  - Success: returns correctly parsed `WeatherData`
  - HTTP error (`res.ok = false`): returns `null`
  - Malformed response (no `daily` / empty `time`): returns `null`

### `src/data/itinerary.test.ts`

- `getDay('j1')` → returns day 1
- `getDay('nonexistent')` → returns `undefined`
- `getTodayDay()` with mocked date `2026-04-08` → returns J1
- `getTodayDay()` with mocked date `2025-01-01` → returns `undefined`
- `ITINERARY` integrity: 11 entries, unique IDs, chronological dates, required fields present (`id`, `number`, `date`, `title`, `location`, `schedule`, `stages`)

### `src/lib/media-utils.test.ts`

- `isVideoFile({ type: 'video/mp4' })` → `true`
- `isVideoFile({ type: 'image/jpeg' })` → `false`
- `isImageFile({ type: 'image/png' })` → `true`
- `isImageFile({ type: 'video/mp4' })` → `false`

### `src/lib/auth.test.ts`

- `isFamilyMember` with `claims.familyMember === true` → `true`
- `isFamilyMember` with `claims.familyMember === false` → `false`
- `isFamilyMember` without the claim → `false`

### `src/data/infos.test.ts`

- `BUDGET_CATEGORIES`: each item has `label`, `amount`, `status`
- `CONTACTS`: each contact has `icon`, `label`, `detail`
- `TRIP_STATS`: has `days`, `nights`, `km`
- `GENERAL_TIPS`: non-empty array of strings

### `src/data/family.test.ts`

- `fetchFamilyMembers` with mocked `getDocs` snapshot: returns correctly mapped `{ email, name, initial }`
- Missing name → initial defaults to `'?'`

## Setup & Configuration

### Coverage config in `vite.config.ts`

```ts
test: {
  environment: 'jsdom',
  coverage: {
    provider: 'v8',
    include: ['src/lib/**', 'src/data/**'],
    reporter: ['text', 'json', 'json-summary'],
    reportsDirectory: 'coverage',
  },
}
```

### Scripts in `package.json`

- `"test"` — `vitest run` (already exists)
- `"test:coverage"` — `vitest run --coverage`

### CI Integration

- Coverage reports output to `coverage/` directory
- `json-summary` reporter provides machine-readable results for CI
- **No coverage gate/threshold** for now — observe actual numbers first, then decide on enforcement

### Git Workflow

1. Checkout `main` and pull latest from `origin/main`
2. Create branch `feat/unit-tests` from updated `main`
3. Implement tests and config
4. Push and open PR

## Dependencies

May need to install `@vitest/coverage-v8` (check if already present).
