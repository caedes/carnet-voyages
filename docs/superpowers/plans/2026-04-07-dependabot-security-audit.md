# Dependabot + Security Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up Dependabot for automated dependency updates, add security audit to CI, auto-merge low-risk Dependabot PRs, and fix existing CVEs.

**Architecture:** Four independent config files/changes: Dependabot config, CI audit step, auto-merge workflow, and vite upgrade. All changes are configuration-level — no application code changes.

**Tech Stack:** GitHub Dependabot, GitHub Actions, yarn v1

---

## File Structure

- **Create:** `.github/dependabot.yml` — Dependabot configuration for npm + github-actions ecosystems
- **Modify:** `.github/workflows/ci.yml` — Add security audit step after install
- **Create:** `.github/workflows/dependabot-auto-merge.yml` — Auto-merge workflow for patch/minor Dependabot PRs
- **Modify:** `yarn.lock` — Upgrade vite to fix CVEs

---

### Task 1: Fix current CVEs by upgrading vite

**Files:**
- Modify: `yarn.lock`

- [ ] **Step 1: Verify current vulnerabilities**

Run: `yarn audit --level high 2>&1 | tail -5`
Expected: `12 vulnerabilities found` with severity High

- [ ] **Step 2: Upgrade vite**

```bash
yarn upgrade vite
```

This upgrades vite from `7.3.1` to `>=7.3.2` in `yarn.lock`. The `^7.3.1` range in `package.json` already allows this — no `package.json` change needed.

- [ ] **Step 3: Verify vulnerabilities are resolved**

Run: `yarn audit --level high 2>&1 | tail -5`
Expected: `0 vulnerabilities found` (or no high/critical remaining)

- [ ] **Step 4: Run existing tests to verify nothing broke**

Run: `yarn test`
Expected: All tests pass

- [ ] **Step 5: Run build to verify nothing broke**

Run: `yarn build`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add yarn.lock
git commit -m "fix: upgrade vite to resolve 12 CVEs"
```

---

### Task 2: Add Dependabot configuration

**Files:**
- Create: `.github/dependabot.yml`

- [ ] **Step 1: Create the Dependabot config file**

Create `.github/dependabot.yml` with this content:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
```

- [ ] **Step 2: Validate YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/dependabot.yml'))"`
Expected: No output (valid YAML)

- [ ] **Step 3: Commit**

```bash
git add .github/dependabot.yml
git commit -m "feat: add Dependabot config for npm and GitHub Actions"
```

---

### Task 3: Add security audit step to CI

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Add the audit step after install, before lint**

In `.github/workflows/ci.yml`, add this step between "Install dependencies" and "Lint":

```yaml
      - name: Security audit
        run: yarn audit --level high
```

The full file should now be:

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

      - name: Security audit
        run: yarn audit --level high

      - name: Lint
        run: yarn lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: yarn test

      - name: Build
        run: yarn build
```

- [ ] **Step 2: Validate YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"`
Expected: No output (valid YAML)

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "feat: add yarn audit security check to CI pipeline"
```

---

### Task 4: Add Dependabot auto-merge workflow

**Files:**
- Create: `.github/workflows/dependabot-auto-merge.yml`

- [ ] **Step 1: Create the auto-merge workflow**

Create `.github/workflows/dependabot-auto-merge.yml` with this content:

```yaml
name: Dependabot Auto-Merge

on: pull_request_target

permissions:
  contents: write
  pull-requests: write

jobs:
  dependabot:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    steps:
      - name: Fetch Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v2
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"

      - name: Auto-approve patch and minor updates
        if: steps.metadata.outputs.update-type != 'version-update:semver-major'
        run: gh pr review --approve "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Auto-merge patch and minor updates
        if: steps.metadata.outputs.update-type != 'version-update:semver-major'
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 2: Validate YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/dependabot-auto-merge.yml'))"`
Expected: No output (valid YAML)

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/dependabot-auto-merge.yml
git commit -m "feat: add auto-merge workflow for Dependabot patch/minor PRs"
```

---

### Task 5: Final verification

- [ ] **Step 1: Run full CI locally**

```bash
yarn install --frozen-lockfile && yarn audit --level high && yarn lint && npx tsc --noEmit && yarn test && yarn build
```

Expected: All steps pass with zero high-severity vulnerabilities.

- [ ] **Step 2: Verify all files are committed**

Run: `git status`
Expected: Clean working tree, nothing to commit.

- [ ] **Step 3: Push branch and create PR**

```bash
git push -u origin feat/dependabot-security-audit
gh pr create --title "feat: add Dependabot + security audit to CI" --body "## Summary
- Add Dependabot config for npm and GitHub Actions (weekly)
- Add yarn audit --level high to CI pipeline
- Add auto-merge workflow for Dependabot patch/minor PRs
- Fix 12 existing CVEs by upgrading vite to >=7.3.2

## Test plan
- [ ] CI passes on this PR (audit step included)
- [ ] Dependabot creates first PRs within a week
- [ ] Auto-merge workflow triggers on Dependabot patch PRs"
```
