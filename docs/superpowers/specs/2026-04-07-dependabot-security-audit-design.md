# Dependabot + Security Audit

## Context

The project (`caedes/carnet-voyages`) has no dependency monitoring in place. A `yarn audit` reveals 12 vulnerabilities (6 high, 3 moderate, 3 low), all in `vite` — patched in `>=7.3.2`.

The goal is to:
- Automatically monitor and update dependencies via Dependabot
- Block PRs that introduce high-severity CVEs
- Auto-merge low-risk Dependabot PRs to reduce manual toil
- Fix the existing vulnerabilities

## Deliverables

### 1. Dependabot configuration — `.github/dependabot.yml`

Two ecosystems monitored:

- **npm** (package-ecosystem: `npm`, directory: `/`) — monitors `package.json` + `yarn.lock`
- **github-actions** (package-ecosystem: `github-actions`, directory: `/`) — monitors `uses:` references in workflow files

Shared settings:
- Schedule: `weekly`
- `open-pull-requests-limit: 10`
- Labels: `["dependencies"]`

### 2. Security audit step in CI — `.github/workflows/ci.yml`

Add a step after dependency install and before lint:

```yaml
- name: Security audit
  run: yarn audit --level high
```

This fails the CI pipeline if any high or critical severity vulnerability is found. Low and moderate vulnerabilities do not block the build.

Placement in pipeline order:
1. Checkout
2. Setup Node
3. Install dependencies
4. **Security audit** (new)
5. Lint
6. Type check
7. Test
8. Build

### 3. Auto-merge workflow — `.github/workflows/dependabot-auto-merge.yml`

A new workflow triggered on Dependabot pull requests that:

- Triggers on `pull_request_target` from Dependabot
- Fetches PR metadata via `gh pr view` to check the update type
- Only proceeds for **patch** and **minor** updates (major bumps require manual review)
- Waits for CI to pass
- Auto-approves the PR (`gh pr review --approve`)
- Squash-merges the PR (`gh pr merge --squash --auto`)

Permissions required:
- `pull-requests: write`
- `contents: write`

No external PAT needed — uses the default `GITHUB_TOKEN`.

### 4. Fix current CVEs — upgrade vite

All 12 current vulnerabilities are in `vite` (direct dependency and transitive via `vitest`).

- Current: `^7.3.1` (resolves to `7.3.1`)
- Fix: `>=7.3.2`
- Action: `yarn upgrade vite` to update `yarn.lock`

CVEs resolved:
- Arbitrary File Read via Vite Dev Server WebSocket (high) x3
- `server.fs.deny` bypassed with queries (high) x3
- Path Traversal in Optimized Deps `.map` Handling (moderate) x3
- 3 additional low-severity advisories

## Out of scope

- No changes to the build, test, or lint configuration
- No changes to application code
- No additional security tooling (Snyk, Socket, etc.)
