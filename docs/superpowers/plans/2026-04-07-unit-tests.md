# Unit Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Achieve 80%+ coverage on `src/lib/` and `src/data/` with meaningful unit tests, with CI-visible coverage reports.

**Architecture:** Co-located test files (`module.test.ts` next to `module.ts`). Mock at our internal Firebase layer (`#/lib/firebase`), not the SDK. Coverage via `@vitest/coverage-v8` with JSON + text reporters for CI consumption.

**Tech Stack:** Vitest, @vitest/coverage-v8, @testing-library/react (already installed)

**Spec:** `docs/superpowers/specs/2026-04-07-unit-tests-design.md`

---

### Task 0: Setup — Install coverage dependency and configure

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts:14-16`

- [ ] **Step 1: Switch to main and pull latest**

```bash
git checkout main
git pull origin main
```

- [ ] **Step 2: Create feature branch**

```bash
git checkout -b feat/unit-tests
```

- [ ] **Step 3: Install coverage provider**

```bash
yarn add -D @vitest/coverage-v8
```

- [ ] **Step 4: Add coverage config to `vite.config.ts`**

Replace the `test` block (lines 14-16) with:

```ts
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['src/lib/**', 'src/data/**'],
      reporter: ['text', 'json', 'json-summary'],
      reportsDirectory: 'coverage',
    },
  },
```

- [ ] **Step 5: Add `test:coverage` script to `package.json`**

Add to `"scripts"`:

```json
"test:coverage": "vitest run --coverage"
```

- [ ] **Step 6: Add `coverage/` to `.gitignore`**

Append:

```
coverage/
```

- [ ] **Step 7: Run existing tests to verify nothing is broken**

```bash
yarn test
```

Expected: 5 tests pass (all from `weather.test.ts`).

- [ ] **Step 8: Commit**

```bash
git add vite.config.ts package.json yarn.lock .gitignore
git commit -m "chore: add vitest coverage config and test:coverage script"
```

---

### Task 1: Tests for `src/lib/weather.ts` — `fetchWeather`

**Files:**
- Modify: `src/lib/weather.test.ts`

- [ ] **Step 1: Write failing tests for `fetchWeather`**

Add to `src/lib/weather.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getWeatherDisplay } from './weather'

// existing getWeatherDisplay tests stay unchanged

// fetchWeather is not exported, so we test it through the module internals.
// We need to re-export it for testing or test via useWeather.
// Since fetchWeather is private, we'll test it by dynamically importing:

describe('fetchWeather', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns parsed weather data on success', async () => {
    const mockDaily = {
      time: ['2026-04-08'],
      temperature_2m_max: [12],
      temperature_2m_min: [3],
      temperature_2m_mean: [7.5],
      precipitation_probability_max: [20],
      wind_speed_10m_max: [15],
      weather_code: [2],
    }

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ daily: mockDaily }),
    } as Response)

    // Import the module to access fetchWeather via useWeather's queryFn
    // Since fetchWeather is not exported, we test the exported wrapper
    const { fetchWeather } = await import('./weather')
    const result = await fetchWeather(45.5, -73.5, '2026-04-08')

    expect(result).toEqual({
      temperatureMax: 12,
      temperatureMin: 3,
      temperatureMean: 7.5,
      precipitationProbability: 20,
      windSpeed: 15,
      weatherCode: 2,
    })
    expect(fetch).toHaveBeenCalledOnce()
    expect(vi.mocked(fetch).mock.calls[0][0]).toContain('latitude=45.5')
    expect(vi.mocked(fetch).mock.calls[0][0]).toContain('longitude=-73.5')
    expect(vi.mocked(fetch).mock.calls[0][0]).toContain('start_date=2026-04-08')
  })

  it('returns null on HTTP error', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    const { fetchWeather } = await import('./weather')
    const result = await fetchWeather(45.5, -73.5, '2026-04-08')

    expect(result).toBeNull()
  })

  it('returns null when daily data is missing', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)

    const { fetchWeather } = await import('./weather')
    const result = await fetchWeather(45.5, -73.5, '2026-04-08')

    expect(result).toBeNull()
  })

  it('returns null when daily.time is empty', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ daily: { time: [] } }),
    } as Response)

    const { fetchWeather } = await import('./weather')
    const result = await fetchWeather(45.5, -73.5, '2026-04-08')

    expect(result).toBeNull()
  })
})
```

**Note:** `fetchWeather` is currently not exported. Step 3 will export it.

- [ ] **Step 2: Run tests to verify they fail**

```bash
yarn test src/lib/weather.test.ts
```

Expected: FAIL — `fetchWeather` is not exported.

- [ ] **Step 3: Export `fetchWeather` in `src/lib/weather.ts`**

Change line 42 from:

```ts
async function fetchWeather(lat: number, lng: number, date: string): Promise<WeatherData | null> {
```

to:

```ts
export async function fetchWeather(lat: number, lng: number, date: string): Promise<WeatherData | null> {
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
yarn test src/lib/weather.test.ts
```

Expected: All 9 tests pass (5 existing + 4 new).

- [ ] **Step 5: Commit**

```bash
git add src/lib/weather.ts src/lib/weather.test.ts
git commit -m "test: add fetchWeather tests with mocked fetch API"
```

---

### Task 2: Tests for `src/data/itinerary.ts`

**Files:**
- Create: `src/data/itinerary.test.ts`

- [ ] **Step 1: Write tests**

Create `src/data/itinerary.test.ts`:

```ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { ITINERARY, getDay, getTodayDay } from './itinerary'

describe('getDay', () => {
  it('returns the correct day for a valid ID', () => {
    const day = getDay('j1')
    expect(day).toBeDefined()
    expect(day!.id).toBe('j1')
    expect(day!.number).toBe(1)
    expect(day!.title).toBe('Arrivée à Montréal')
  })

  it('returns the last day for j11', () => {
    const day = getDay('j11')
    expect(day).toBeDefined()
    expect(day!.number).toBe(11)
  })

  it('returns undefined for a nonexistent ID', () => {
    expect(getDay('j99')).toBeUndefined()
  })

  it('returns undefined for an empty string', () => {
    expect(getDay('')).toBeUndefined()
  })
})

describe('getTodayDay', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the matching day when today is a trip date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-08T12:00:00'))

    const day = getTodayDay()
    expect(day).toBeDefined()
    expect(day!.id).toBe('j1')
    expect(day!.date).toBe('2026-04-08')
  })

  it('returns undefined when today is outside the trip dates', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T12:00:00'))

    expect(getTodayDay()).toBeUndefined()
  })
})

describe('ITINERARY integrity', () => {
  it('has exactly 11 days', () => {
    expect(ITINERARY).toHaveLength(11)
  })

  it('has unique IDs', () => {
    const ids = ITINERARY.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has chronologically ordered dates', () => {
    for (let i = 1; i < ITINERARY.length; i++) {
      expect(ITINERARY[i].date > ITINERARY[i - 1].date).toBe(true)
    }
  })

  it('has sequential day numbers from 1 to 11', () => {
    ITINERARY.forEach((day, i) => {
      expect(day.number).toBe(i + 1)
    })
  })

  it('has required fields on every day', () => {
    ITINERARY.forEach((day) => {
      expect(day.id).toBeTruthy()
      expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(day.title).toBeTruthy()
      expect(day.location).toBeDefined()
      expect(day.location.lat).toBeTypeOf('number')
      expect(day.location.lng).toBeTypeOf('number')
      expect(Array.isArray(day.schedule)).toBe(true)
      expect(Array.isArray(day.stages)).toBe(true)
      expect(day.stages.length).toBeGreaterThan(0)
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
yarn test src/data/itinerary.test.ts
```

Expected: All 9 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/data/itinerary.test.ts
git commit -m "test: add itinerary tests — getDay, getTodayDay, data integrity"
```

---

### Task 3: Tests for `src/lib/media-utils.ts`

**Files:**
- Create: `src/lib/media-utils.test.ts`

- [ ] **Step 1: Write tests**

Create `src/lib/media-utils.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { isVideoFile, isImageFile } from './media-utils'

function fakeFile(type: string): File {
  return new File([''], 'test', { type })
}

describe('isVideoFile', () => {
  it('returns true for video/mp4', () => {
    expect(isVideoFile(fakeFile('video/mp4'))).toBe(true)
  })

  it('returns true for video/quicktime', () => {
    expect(isVideoFile(fakeFile('video/quicktime'))).toBe(true)
  })

  it('returns false for image/jpeg', () => {
    expect(isVideoFile(fakeFile('image/jpeg'))).toBe(false)
  })

  it('returns false for application/pdf', () => {
    expect(isVideoFile(fakeFile('application/pdf'))).toBe(false)
  })
})

describe('isImageFile', () => {
  it('returns true for image/png', () => {
    expect(isImageFile(fakeFile('image/png'))).toBe(true)
  })

  it('returns true for image/jpeg', () => {
    expect(isImageFile(fakeFile('image/jpeg'))).toBe(true)
  })

  it('returns false for video/mp4', () => {
    expect(isImageFile(fakeFile('video/mp4'))).toBe(false)
  })

  it('returns false for text/plain', () => {
    expect(isImageFile(fakeFile('text/plain'))).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
yarn test src/lib/media-utils.test.ts
```

Expected: All 8 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/lib/media-utils.test.ts
git commit -m "test: add isVideoFile and isImageFile tests"
```

---

### Task 4: Tests for `src/lib/auth.ts` — `isFamilyMember`

**Files:**
- Create: `src/lib/auth.test.ts`

- [ ] **Step 1: Write tests**

Create `src/lib/auth.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'

// Mock firebase modules before importing auth
vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('./firebase', () => ({
  getFirebaseAuth: vi.fn(),
}))

import { isFamilyMember } from './auth'
import type { User } from 'firebase/auth'

function mockUser(claims: Record<string, unknown>): User {
  return {
    getIdTokenResult: vi.fn().mockResolvedValue({ claims }),
  } as unknown as User
}

describe('isFamilyMember', () => {
  it('returns true when familyMember claim is true', async () => {
    const user = mockUser({ familyMember: true })
    expect(await isFamilyMember(user)).toBe(true)
  })

  it('returns false when familyMember claim is false', async () => {
    const user = mockUser({ familyMember: false })
    expect(await isFamilyMember(user)).toBe(false)
  })

  it('returns false when familyMember claim is absent', async () => {
    const user = mockUser({})
    expect(await isFamilyMember(user)).toBe(false)
  })

  it('returns false when familyMember claim is a string', async () => {
    const user = mockUser({ familyMember: 'true' })
    expect(await isFamilyMember(user)).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
yarn test src/lib/auth.test.ts
```

Expected: All 4 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/lib/auth.test.ts
git commit -m "test: add isFamilyMember tests with mocked Firebase User"
```

---

### Task 5: Tests for `src/data/infos.ts`

**Files:**
- Create: `src/data/infos.test.ts`

- [ ] **Step 1: Write tests**

Create `src/data/infos.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  BUDGET_CATEGORIES,
  BUDGET_TOTAL_CONFIRMED,
  BUDGET_EXTRA,
  TRIP_STATS,
  CONTACTS,
  GENERAL_TIPS,
} from './infos'

describe('BUDGET_CATEGORIES', () => {
  it('has at least one category', () => {
    expect(BUDGET_CATEGORIES.length).toBeGreaterThan(0)
  })

  it('every item has label, amount, and status', () => {
    BUDGET_CATEGORIES.forEach((cat) => {
      expect(cat.category).toBeTruthy()
      expect(cat.items.length).toBeGreaterThan(0)
      cat.items.forEach((item) => {
        expect(item.label).toBeTruthy()
        expect(item.amount).toMatch(/€/)
        expect(['confirmed', 'estimated']).toContain(item.status)
      })
    })
  })
})

describe('BUDGET_TOTAL_CONFIRMED', () => {
  it('is a string containing €', () => {
    expect(BUDGET_TOTAL_CONFIRMED).toContain('€')
  })
})

describe('BUDGET_EXTRA', () => {
  it('is a non-empty string', () => {
    expect(BUDGET_EXTRA.length).toBeGreaterThan(0)
  })
})

describe('TRIP_STATS', () => {
  it('has days, nights, and km', () => {
    expect(TRIP_STATS.days).toBeTypeOf('number')
    expect(TRIP_STATS.nights).toBeTypeOf('number')
    expect(TRIP_STATS.km).toBeTruthy()
  })

  it('nights is days minus 1', () => {
    expect(TRIP_STATS.nights).toBe(TRIP_STATS.days - 1)
  })
})

describe('CONTACTS', () => {
  it('is a non-empty array', () => {
    expect(CONTACTS.length).toBeGreaterThan(0)
  })

  it('every contact has icon, label, and detail', () => {
    CONTACTS.forEach((c) => {
      expect(c.icon).toBeTruthy()
      expect(c.label).toBeTruthy()
      expect(c.detail).toBeTruthy()
    })
  })
})

describe('GENERAL_TIPS', () => {
  it('is a non-empty array of strings', () => {
    expect(GENERAL_TIPS.length).toBeGreaterThan(0)
    GENERAL_TIPS.forEach((tip) => {
      expect(tip).toBeTypeOf('string')
      expect(tip.length).toBeGreaterThan(0)
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
yarn test src/data/infos.test.ts
```

Expected: All 8 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/data/infos.test.ts
git commit -m "test: add infos static data integrity tests"
```

---

### Task 6: Tests for `src/data/family.ts` — `fetchFamilyMembers`

**Files:**
- Create: `src/data/family.test.ts`

- [ ] **Step 1: Write tests**

Create `src/data/family.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
}))

vi.mock('#/lib/firebase', () => ({
  getFirebaseDb: vi.fn(() => 'mocked-db'),
}))

// Must import after mocks are set up
import { getDocs } from 'firebase/firestore'

// fetchFamilyMembers is not exported — we need to export it
import { fetchFamilyMembers } from './family'

function mockSnapshot(docs: Array<{ email?: string; name?: string }>) {
  vi.mocked(getDocs).mockResolvedValue({
    docs: docs.map((data) => ({
      data: () => data,
    })),
  } as never)
}

describe('fetchFamilyMembers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns correctly mapped family members', async () => {
    mockSnapshot([
      { email: 'romain@test.com', name: 'Romain' },
      { email: 'cecilia@test.com', name: 'Cécilia' },
    ])

    const members = await fetchFamilyMembers()

    expect(members).toEqual([
      { email: 'romain@test.com', name: 'Romain', initial: 'R' },
      { email: 'cecilia@test.com', name: 'Cécilia', initial: 'C' },
    ])
  })

  it('defaults initial to ? when name is missing', async () => {
    mockSnapshot([{ email: 'unknown@test.com' }])

    const members = await fetchFamilyMembers()

    expect(members).toEqual([
      { email: 'unknown@test.com', name: undefined, initial: '?' },
    ])
  })

  it('returns empty array when no documents exist', async () => {
    mockSnapshot([])

    const members = await fetchFamilyMembers()

    expect(members).toEqual([])
  })
})
```

**Note:** `fetchFamilyMembers` is currently not exported. Step 3 will export it.

- [ ] **Step 2: Run tests to verify they fail**

```bash
yarn test src/data/family.test.ts
```

Expected: FAIL — `fetchFamilyMembers` is not exported.

- [ ] **Step 3: Export `fetchFamilyMembers` in `src/data/family.ts`**

Change line 6 from:

```ts
async function fetchFamilyMembers(): Promise<FamilyMember[]> {
```

to:

```ts
export async function fetchFamilyMembers(): Promise<FamilyMember[]> {
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
yarn test src/data/family.test.ts
```

Expected: All 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/family.ts src/data/family.test.ts
git commit -m "test: add fetchFamilyMembers tests with mocked Firestore"
```

---

### Task 7: Run full coverage and open PR

**Files:** None (verification only)

- [ ] **Step 1: Run all tests**

```bash
yarn test
```

Expected: All tests pass (~36 tests across 6 files).

- [ ] **Step 2: Run coverage report**

```bash
yarn test:coverage
```

Expected: Coverage report printed to terminal + `coverage/` directory created with JSON files. Verify `src/lib/` and `src/data/` are above 80%.

- [ ] **Step 3: Type check**

```bash
yarn tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit spec and plan docs**

```bash
git add docs/superpowers/specs/2026-04-07-unit-tests-design.md docs/superpowers/plans/2026-04-07-unit-tests.md
git commit -m "docs: add unit tests spec and implementation plan"
```

- [ ] **Step 5: Push and create PR**

```bash
git push -u origin feat/unit-tests
```

Create PR with:
- **Title:** `test: add unit tests for lib/ and data/ with coverage reporting`
- **Body:** Summary of what's tested, coverage numbers, link to spec.
