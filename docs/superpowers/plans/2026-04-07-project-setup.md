# Project Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up CI, branch protection workflow, business README, and first unit test so all future development follows a branch+PR+CI pattern.

**Architecture:** Move the boilerplate README to docs, replace with a family-oriented description. Add Vitest config, write a first test for `getWeatherDisplay`. Create a GitHub Actions workflow that runs lint, type-check, tests, and build on PRs. Document the git workflow convention in AGENTS.md.

**Tech Stack:** Vitest, GitHub Actions, Node 24, Yarn

---

### Task 1: Move README to docs and write business README

**Files:**
- Move: `README.md` → `docs/TECHNICAL.md`
- Create: `README.md` (new business/family content)

- [ ] **Step 1: Move current README to docs/**

```bash
git mv README.md docs/TECHNICAL.md
```

- [ ] **Step 2: Create new business README**

Create `README.md` with this content:

```markdown
# Carnet de Voyages — Canada 2026

Notre carnet de voyage en famille au Canada, été 2026 — avec Cécilia et Julia.

## Ce que permet l'application

- **Journal jour par jour** — revivre chaque étape du voyage, avec la météo du jour
- **Souvenirs photo & vidéo** — capturer et retrouver nos plus beaux moments
- **Infos pratiques** — tout ce qu'il faut savoir pour le voyage, au même endroit

## Pour les développeurs

Voir [docs/TECHNICAL.md](docs/TECHNICAL.md) pour la documentation technique et [AGENTS.md](AGENTS.md) pour les conventions du projet.

---

*Construit avec React, TanStack & Firebase.*
```

- [ ] **Step 3: Verify files are in place**

```bash
ls docs/TECHNICAL.md && head -1 README.md
```

Expected: `docs/TECHNICAL.md` exists, `README.md` first line is `# Carnet de Voyages — Canada 2026`

- [ ] **Step 4: Commit**

```bash
git add README.md docs/TECHNICAL.md
git commit -m "chore: replace boilerplate README with family travel description

Move technical README to docs/TECHNICAL.md. New README describes the
app from a user/family perspective."
```

---

### Task 2: Add Vitest config and write first test

**Files:**
- Modify: `vite.config.ts` (add `test` block)
- Create: `src/lib/weather.test.ts`

- [ ] **Step 1: Add test configuration to vite.config.ts**

In `vite.config.ts`, add the `test` property inside `defineConfig`. The file should become:

```ts
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    TanStackRouterVite(),
    viteReact(),
  ],
  test: {
    environment: 'jsdom',
  },
})

export default config
```

- [ ] **Step 2: Write the test file**

Create `src/lib/weather.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getWeatherDisplay } from './weather'

describe('getWeatherDisplay', () => {
  it('returns sunny for code 0', () => {
    expect(getWeatherDisplay(0)).toEqual({ icon: '☀️', label: 'Ensoleillé' })
  })

  it('returns rain for code 63', () => {
    expect(getWeatherDisplay(63)).toEqual({ icon: '🌧️', label: 'Pluie' })
  })

  it('returns heavy snow for code 75', () => {
    expect(getWeatherDisplay(75)).toEqual({ icon: '❄️', label: 'Forte neige' })
  })

  it('returns storm for code 95', () => {
    expect(getWeatherDisplay(95)).toEqual({ icon: '⛈️', label: 'Orage' })
  })

  it('returns fallback for unknown code', () => {
    expect(getWeatherDisplay(999)).toEqual({ icon: '🌡️', label: 'Inconnu' })
  })
})
```

- [ ] **Step 3: Run the test to verify it passes**

```bash
yarn test
```

Expected: 5 tests pass, all green.

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts src/lib/weather.test.ts
git commit -m "test: add first unit test for getWeatherDisplay

Configure Vitest in vite.config.ts and add tests for weather code
mapping including known codes and unknown fallback."
```

---

### Task 3: Create GitHub Actions CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create the workflow directory**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: Create the CI workflow file**

Create `.github/workflows/ci.yml`:

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

- [ ] **Step 3: Validate YAML syntax**

```bash
cat .github/workflows/ci.yml | python3 -c "import sys, yaml; yaml.safe_load(sys.stdin); print('YAML OK')"
```

Expected: `YAML OK`

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow for PR validation

Runs lint, type-check, tests, and build on pull requests to main.
Uses Node 24 to match local dev environment."
```

---

### Task 4: Update AGENTS.md with Git Workflow convention

**Files:**
- Modify: `AGENTS.md` (append Git Workflow section at the end)

- [ ] **Step 1: Add Git Workflow section to AGENTS.md**

Append the following at the end of `AGENTS.md`:

```markdown

## Git Workflow

- Never commit directly to `main`. Always create a feature branch.
- Branch naming: `feat/short-description`, `fix/short-description`, `chore/short-description`
- All changes reach `main` via pull requests.
- CI must pass before merging. The author reviews and merges.
```

- [ ] **Step 2: Verify the section was added**

```bash
tail -6 AGENTS.md
```

Expected: the Git Workflow section appears at the end.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add git workflow convention to AGENTS.md

Document branch+PR workflow: no direct commits to main, feature
branches required, CI must pass before merge."
```

---

### Task 5: Push and verify

- [ ] **Step 1: Push all commits to main**

```bash
git push origin main
```

- [ ] **Step 2: Verify on GitHub**

```bash
gh browse
```

Confirm: new README visible on repo homepage, `docs/TECHNICAL.md` present, `.github/workflows/ci.yml` exists.

---

### Task 6: Configure GitHub Rulesets (manual — user action)

This task is performed by the user in the GitHub UI, following the guide in the spec (`docs/superpowers/specs/2026-04-07-project-setup-design.md`, section 2).

- [ ] **Step 1: Follow the step-by-step guide** in the spec to create the "Protect main" ruleset
- [ ] **Step 2: Verify** by creating a test branch, pushing it, and confirming that direct pushes to `main` are blocked

```bash
git checkout -b test/verify-protection
git commit --allow-empty -m "test: verify branch protection"
git push origin test/verify-protection
gh pr create --title "test: verify branch protection" --body "Testing CI and branch rules. Will delete."
```

Wait for CI to run, then delete the PR and branch:

```bash
gh pr close --delete-branch
git checkout main
```
