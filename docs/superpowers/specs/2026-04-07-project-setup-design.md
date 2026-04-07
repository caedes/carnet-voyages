# Project Setup: README, Branch Protection, CI & First Test

**Date:** 2026-04-07
**Status:** Draft

---

## 1. README Business + README Technique

### What changes

- **Move** current `README.md` → `docs/TECHNICAL.md` (as-is, no edits)
- **Create** new `README.md` with a personal/family tone:
  - Title: "Carnet de Voyages — Canada 2026"
  - Description: a family travel journal app for a Canada trip (summer 2026) with Cécilia and Julia
  - Features: day-by-day journal, photo/video souvenirs, weather info, practical travel info
  - One-liner at the bottom mentioning the tech stack (no details)
  - Link to `docs/TECHNICAL.md` for developers

### What doesn't change

- `AGENTS.md` stays as-is (already has all technical/agent instructions)

---

## 2. Branch Protection — GitHub Rulesets (Step-by-Step Guide)

Since the repository is on GitHub (`caedes/carnet-voyages`), we use the new **Repository Rules** system (Rulesets), which replaced the legacy "Branch protection rules."

### Step-by-step in GitHub UI

1. Go to **github.com/caedes/carnet-voyages**
2. Click **Settings** (top menu bar)
3. In the left sidebar, click **Rules** → **Rulesets**
4. Click **New ruleset** → **New branch ruleset**
5. Configure:
   - **Ruleset name:** `Protect main`
   - **Enforcement status:** `Active`
   - **Target branches:** click "Add target" → "Include by pattern" → type `main`
6. Under **Rules**, enable:
   - **Require a pull request before merging**
     - Set "Required approvals" to `0` (you review and merge yourself)
     - Leave other sub-options off
   - **Require status checks to pass before merging**
     - Check "Require branches to be up to date before merging"
     - Add status check: `ci` (this is the job name from our GitHub Actions workflow)
   - **Block force pushes** (enabled by default, keep it)
7. Under **Bypass list**: add yourself (`caedes`) so you can merge PRs
8. Click **Create**

### Notes

- "Required approvals = 0" means a PR is required but you don't need someone else to approve — you can merge it yourself after CI passes.
- The `ci` status check name must match the job name in `.github/workflows/ci.yml` exactly.

---

## 3. Git Workflow & CI

### Convention: branches + PRs for all development

All work happens on feature branches, never directly on `main`. Every change reaches `main` via a pull request with passing CI.

**Files to update:**
- `AGENTS.md` — add a "Git Workflow" section documenting this convention

**Content to add to AGENTS.md:**

```
## Git Workflow

- Never commit directly to `main`. Always create a feature branch.
- Branch naming: `feat/short-description`, `fix/short-description`, `chore/short-description`
- All changes reach `main` via pull requests.
- CI must pass before merging. The author reviews and merges.
```

### GitHub Actions CI (`.github/workflows/ci.yml`)

Triggers on pull requests targeting `main`.

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '24'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Lint
        run: yarn lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: yarn test

      - name: Build
        run: yarn build
```

**Key decisions:**
- Node 24 (matches local dev environment: v24.14.1 via NVM)
- Single job `ci` (keeps status check configuration simple)
- `yarn install --frozen-lockfile` for reproducible installs
- Order: lint → type-check → test → build (fast-fail on cheapest checks first)

---

## 4. First Unit Test: `getWeatherDisplay`

### File: `src/lib/weather.test.ts`

Tests the pure function `getWeatherDisplay(code: number)` from `src/lib/weather.ts`.

**Test cases:**
- Known code `0` → returns `{ icon: '☀️', label: 'Ensoleillé' }`
- Known code `63` → returns `{ icon: '🌧️', label: 'Pluie' }`
- Known code `75` → returns `{ icon: '❄️', label: 'Forte neige' }`
- Known code `95` → returns `{ icon: '⛈️', label: 'Orage' }`
- Unknown code `999` → returns fallback `{ icon: '🌡️', label: 'Inconnu' }`

### Vitest configuration

Vitest can read from `vite.config.ts` automatically. The existing config includes `tsconfigPaths` which handles path aliases. We add a `test` block to `vite.config.ts`:

```ts
test: {
  environment: 'jsdom',
}
```

This is sufficient — no separate `vitest.config.ts` needed.

---

## Implementation Order

1. Move README → `docs/TECHNICAL.md`, write new README
2. Add test config to `vite.config.ts`, write `weather.test.ts`, verify tests pass
3. Create `.github/workflows/ci.yml`
4. Update `AGENTS.md` with Git Workflow section
5. All of the above delivered as a single PR (first one to establish the workflow)
6. Follow the GitHub Rulesets guide to protect `main` (manual step in UI)

After step 6, all future work follows the branch + PR workflow.
