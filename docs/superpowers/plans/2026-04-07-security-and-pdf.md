# Security Cleanup & PDF Hosting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all personal data (emails) from the codebase and Firebase rules, replace with Firestore-backed family data + custom claims auth, host the trip PDF on Firebase Storage with a download button in the app.

**Architecture:** Family members stored in Firestore collection `family`, fetched via TanStack Query hooks. Authorization via Firebase custom claims (`familyMember: true`) set by a one-shot admin script. PDF served from Firebase Storage with `getDownloadURL`.

**Tech Stack:** Firebase Auth (custom claims), Firestore, Firebase Storage, Firebase Admin SDK, TanStack Query

---

### Task 0: Manual Firebase Console Setup (user action)

This task is performed by the user before code changes begin.

- [ ] **Step 1: Create `family` collection in Firestore**

In Firebase Console → Firestore Database → Start collection:

Collection ID: `family`

Document 1 (auto-ID):
- `email` (string): `laurentromain@gmail.com`
- `name` (string): `Romain`
- `initial` (string): `R`

Document 2 (auto-ID):
- `email` (string): `cecilia.verrons@gmail.com`
- `name` (string): `Cécilia`
- `initial` (string): `C`

Document 3 (auto-ID):
- `email` (string): `julia9laurent@gmail.com`
- `name` (string): `Julia`
- `initial` (string): `J`

- [ ] **Step 2: Upload PDF to Firebase Storage**

In Firebase Console → Storage → Create folder `documents/` → Upload file `carnet_canada_2026_CLV_v3.pdf`, rename to `carnet_canada_2026.pdf` in the folder.

Final path: `documents/carnet_canada_2026.pdf`

---

### Task 1: Create feature branch

**Files:** None (git operation)

- [ ] **Step 1: Create and push feature branch**

```bash
git checkout -b feat/security-cleanup-pdf
```

---

### Task 2: Refactor `src/data/family.ts` to fetch from Firestore

**Files:**
- Rewrite: `src/data/family.ts`

- [ ] **Step 1: Rewrite family.ts with Firestore hooks**

Replace the entire content of `src/data/family.ts` with:

```ts
import { useQuery } from '@tanstack/react-query'
import { collection, getDocs } from 'firebase/firestore'
import { getFirebaseDb } from '#/lib/firebase'
import type { FamilyMember } from './types'

async function fetchFamilyMembers(): Promise<FamilyMember[]> {
  const db = getFirebaseDb()
  const snapshot = await getDocs(collection(db, 'family'))
  return snapshot.docs.map((doc) => ({
    email: doc.data().email,
    name: doc.data().name,
    initial: doc.data().initial,
  }))
}

export function useFamilyMembers() {
  return useQuery({
    queryKey: ['family-members'],
    queryFn: fetchFamilyMembers,
    staleTime: Infinity,
  })
}

export function useFamilyMember(email: string | undefined) {
  const { data: members } = useFamilyMembers()
  return members?.find((m) => m.email === email)
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit
```

Expected: errors in files that still import old exports (`isEmailAllowed`, `FAMILY_MEMBERS`, `getFamilyMember`). That's expected — we fix them in the next tasks.

- [ ] **Step 3: Commit**

```bash
git add src/data/family.ts
git commit -m "refactor: replace hardcoded family data with Firestore hooks

Family members are now fetched from Firestore collection 'family'
via TanStack Query. Removes VITE_ALLOWED_EMAILS dependency."
```

---

### Task 3: Update auth to use custom claims

**Files:**
- Modify: `src/lib/auth.ts`
- Modify: `src/routes/login.tsx`

- [ ] **Step 1: Rewrite auth.ts to check custom claims**

Replace the entire content of `src/lib/auth.ts` with:

```ts
import { useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { getFirebaseAuth } from './firebase'

const provider = new GoogleAuthProvider()

export function signIn() {
  return signInWithPopup(getFirebaseAuth(), provider)
}

export function signOut() {
  return firebaseSignOut(getFirebaseAuth())
}

export async function isFamilyMember(user: User): Promise<boolean> {
  const tokenResult = await user.getIdTokenResult()
  return tokenResult.claims.familyMember === true
}

type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: User }
  | { status: 'unauthenticated' }

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ status: 'loading' })

  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), async (user) => {
      if (user) {
        const allowed = await isFamilyMember(user)
        if (!allowed) {
          await firebaseSignOut(getFirebaseAuth())
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

- [ ] **Step 2: Update login.tsx to use custom claims**

Replace the entire content of `src/routes/login.tsx` with:

```tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Typography, Space, message } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import { signIn, isFamilyMember } from '#/lib/auth'

const { Title, Text } = Typography

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()

  async function handleLogin() {
    try {
      const result = await signIn()
      const allowed = await isFamilyMember(result.user)
      if (!allowed) {
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
      <Space orientation="vertical" align="center" size="large">
        <div style={{ fontSize: 48 }}>🍁</div>
        <Title level={2} style={{ color: '#e2e8f0', margin: 0 }}>
          La Boucle des Traditions
        </Title>
        <Text style={{ color: '#94a3b8', fontSize: 16 }}>
          Québec &amp; Ontario · Avril 2026
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

- [ ] **Step 3: Verify no TypeScript errors in these files**

```bash
npx tsc --noEmit 2>&1 | grep -E "auth\.ts|login\.tsx" || echo "No errors in auth/login files"
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth.ts src/routes/login.tsx
git commit -m "refactor: use Firebase custom claims for authorization

Replace isEmailAllowed() with custom claim check (familyMember).
Auth and login now use isFamilyMember() which checks the ID token."
```

---

### Task 4: Update souvenir page to use `useFamilyMembers()` hook

**Files:**
- Modify: `src/routes/jour/$dayId_.souvenir.nouveau.tsx`

- [ ] **Step 1: Update imports and component**

In `src/routes/jour/$dayId_.souvenir.nouveau.tsx`, make these changes:

Replace the import:
```ts
import { FAMILY_MEMBERS } from '#/data/family'
```
with:
```ts
import { useFamilyMembers } from '#/data/family'
```

Inside the `AddMemoryPage` function, add the hook call near the top (after `const createMemory = useCreateMemory()`):
```ts
  const { data: familyMembers = [] } = useFamilyMembers()
```

Replace the `selectedAuthor` state initialization:
```ts
  const [selectedAuthor, setSelectedAuthor] = useState(() => {
    if (auth.status === 'authenticated') {
      const member = FAMILY_MEMBERS.find((m) => m.email === auth.user.email)
      return member ?? FAMILY_MEMBERS[0]
    }
    return FAMILY_MEMBERS[0]
  })
```
with:
```ts
  const [selectedAuthor, setSelectedAuthor] = useState<{ email: string; name: string; initial: string } | null>(null)
```

Add a `useEffect` after the state declarations to set the default author once family members are loaded:
```ts
  useEffect(() => {
    if (familyMembers.length > 0 && !selectedAuthor) {
      if (auth.status === 'authenticated') {
        const member = familyMembers.find((m) => m.email === auth.user.email)
        setSelectedAuthor(member ?? familyMembers[0])
      } else {
        setSelectedAuthor(familyMembers[0])
      }
    }
  }, [familyMembers, auth, selectedAuthor])
```

Add `useEffect` to the imports from React:
```ts
import { useState, useEffect } from 'react'
```

In `handlePublish`, update the author email/name to use `selectedAuthor` with a null check:
```ts
      await createMemory.mutateAsync({
        dayId,
        stageLabel: selectedStage,
        description: description.trim(),
        authorEmail: selectedAuthor?.email ?? '',
        authorName: selectedAuthor?.name ?? '',
        media: mediaItems,
      })
```

In the author selection JSX, replace `FAMILY_MEMBERS.map` with `familyMembers.map`:
```tsx
          {familyMembers.map((member) => (
            <button
              key={member.email}
              onClick={() => setSelectedAuthor(member)}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border:
                  selectedAuthor?.email === member.email
                    ? '3px solid #6366f1'
                    : '3px solid transparent',
                background:
                  selectedAuthor?.email === member.email
                    ? '#6366f1'
                    : '#334155',
                color: '#fff',
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                transition: 'all 0.2s',
              }}
            >
              {member.initial}
            </button>
          ))}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: clean (all old imports are now removed).

- [ ] **Step 3: Commit**

```bash
git add src/routes/jour/\$dayId_.souvenir.nouveau.tsx
git commit -m "refactor: use useFamilyMembers() hook in souvenir page

Replace static FAMILY_MEMBERS import with Firestore-backed hook.
Author selection now loads dynamically."
```

---

### Task 5: Add PDF card to Infos page

**Files:**
- Modify: `src/routes/_app/infos.tsx`

- [ ] **Step 1: Add PDF imports and handler**

At the top of `src/routes/_app/infos.tsx`, add these imports:

```ts
import { useState } from 'react'
import { FilePdfOutlined } from '@ant-design/icons'
import { ref, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage } from '#/lib/firebase'
```

- [ ] **Step 2: Add PDF card in the component**

Inside the `InfosPage` function, add the state and handler before the return:

```tsx
  const [pdfLoading, setPdfLoading] = useState(false)

  const handleOpenPdf = async () => {
    setPdfLoading(true)
    try {
      const storage = getFirebaseStorage()
      const pdfRef = ref(storage, 'documents/carnet_canada_2026.pdf')
      const url = await getDownloadURL(pdfRef)
      window.open(url, '_blank')
    } catch {
      // silently fail — button just stops loading
    } finally {
      setPdfLoading(false)
    }
  }
```

Add the card as the first child inside the outer `<div>`, before the Budget card comment:

```tsx
      {/* Carnet de voyage PDF */}
      <Card style={cardStyle}>
        {sectionTitle('Carnet de voyage')}
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={handleOpenPdf}
            loading={pdfLoading}
            style={{
              background: '#6366f1',
              borderColor: '#6366f1',
              borderRadius: 8,
            }}
          >
            Voir le carnet de voyage
          </Button>
        </div>
      </Card>
```

Also add `Button` to the antd import:

```ts
import { Card, Typography, Button } from 'antd'
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/routes/_app/infos.tsx
git commit -m "feat: add PDF download button in Infos page

Fetches the trip PDF from Firebase Storage and opens it in a new
tab. PDF is hosted at documents/carnet_canada_2026.pdf."
```

---

### Task 6: Update Firebase security rules

**Files:**
- Rewrite: `firestore.rules`
- Rewrite: `storage.rules`

- [ ] **Step 1: Update firestore.rules**

Replace the entire content of `firestore.rules` with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAllowedUser() {
      return request.auth != null &&
        request.auth.token.familyMember == true;
    }

    match /family/{memberId} {
      allow read: if isAllowedUser();
    }

    match /memories/{memoryId} {
      allow read, write: if isAllowedUser();
    }
  }
}
```

- [ ] **Step 2: Update storage.rules**

Replace the entire content of `storage.rules` with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAllowedUser() {
      return request.auth != null &&
        request.auth.token.familyMember == true;
    }

    match /memories/{allPaths=**} {
      allow read, write: if isAllowedUser();
    }

    match /documents/{allPaths=**} {
      allow read: if isAllowedUser();
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add firestore.rules storage.rules
git commit -m "security: replace hardcoded emails with custom claims in rules

Both Firestore and Storage rules now check for familyMember custom
claim instead of a hardcoded email allowlist. Adds read access to
family collection and documents/ storage path."
```

---

### Task 7: Create custom claims script

**Files:**
- Create: `scripts/set-claims.js`

- [ ] **Step 1: Install firebase-admin**

```bash
yarn add -D firebase-admin
```

- [ ] **Step 2: Create the script**

Create `scripts/set-claims.js`:

```js
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'

const serviceAccount = JSON.parse(
  readFileSync(new URL('./service-account-key.json', import.meta.url), 'utf8'),
)

initializeApp({ credential: cert(serviceAccount) })

const db = getFirestore()
const auth = getAuth()

async function main() {
  const snapshot = await db.collection('family').get()

  if (snapshot.empty) {
    console.log('No family members found in Firestore.')
    return
  }

  for (const doc of snapshot.docs) {
    const { email, name } = doc.data()
    try {
      const user = await auth.getUserByEmail(email)
      await auth.setCustomUserClaims(user.uid, { familyMember: true })
      console.log(`✓ ${name} (${email}) — claim set`)
    } catch (error) {
      console.error(`✗ ${name} (${email}) — ${error.message}`)
    }
  }

  console.log('\nDone. Users must sign out and sign back in for claims to take effect.')
}

main()
```

- [ ] **Step 3: Verify script syntax**

```bash
node --check scripts/set-claims.js
```

Expected: no output (syntax OK).

- [ ] **Step 4: Commit**

```bash
git add scripts/set-claims.js
git commit -m "feat: add script to set Firebase custom claims for family members

Reads family collection from Firestore, sets familyMember claim on
each user's Firebase Auth profile. Run once after deployment."
```

---

### Task 8: Create scripts documentation and update README

**Files:**
- Create: `scripts/README.md`
- Modify: `README.md`

- [ ] **Step 1: Create scripts/README.md**

Create `scripts/README.md`:

```markdown
# Scripts

## set-claims.js — Gestion des accès famille

Ce script attribue le custom claim `familyMember: true` sur les comptes Firebase Auth des membres de la famille. Ce claim est utilisé par les security rules Firestore et Storage pour contrôler l'accès.

### Prérequis

1. **Service account key** : télécharger depuis Firebase Console → Project Settings → Service Accounts → Generate New Private Key
2. Sauvegarder le fichier sous `scripts/service-account-key.json` (ce fichier est gitignored)
3. `firebase-admin` est déjà dans les devDependencies

### Utilisation

```bash
node scripts/set-claims.js
```

### Ajouter un membre

1. Ajouter un document dans la collection `family` via la Firebase Console (champs : `email`, `name`, `initial`)
2. S'assurer que la personne s'est connectée au moins une fois (pour que son compte Firebase Auth existe)
3. Lancer `node scripts/set-claims.js`
4. La personne doit se déconnecter et se reconnecter

### Retirer un membre

1. Supprimer le document de la collection `family` dans la Firebase Console
2. Pour révoquer immédiatement l'accès, lancer dans un script Node.js :
   ```js
   admin.auth().setCustomUserClaims(uid, { familyMember: false })
   ```
```

- [ ] **Step 2: Update root README.md**

In `README.md`, replace the "Pour les développeurs" section:

```markdown
## Pour les développeurs

Voir [docs/TECHNICAL.md](docs/TECHNICAL.md) pour la documentation technique, [AGENTS.md](AGENTS.md) pour les conventions du projet, et [scripts/README.md](scripts/README.md) pour la gestion des accès famille.
```

- [ ] **Step 3: Commit**

```bash
git add scripts/README.md README.md
git commit -m "docs: add scripts documentation and update README

Add scripts/README.md with instructions for managing family access
via Firebase custom claims. Link from root README."
```

---

### Task 9: Cleanup — remove personal data and PDF from repo

**Files:**
- Modify: `.env.example`
- Modify: `.gitignore`
- Delete: `docs/carnet_canada_2026_CLV_v3.pdf`

- [ ] **Step 1: Update .env.example**

Remove the `VITE_ALLOWED_EMAILS` line from `.env.example`. The file should become:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_SENTRY_DSN=
```

- [ ] **Step 2: Add entries to .gitignore**

Append to `.gitignore`:

```
scripts/service-account-key.json
```

- [ ] **Step 3: Remove PDF from repo**

```bash
git rm docs/carnet_canada_2026_CLV_v3.pdf
```

- [ ] **Step 4: Commit**

```bash
git add .env.example .gitignore
git commit -m "chore: remove personal data and PDF from repository

Remove VITE_ALLOWED_EMAILS from env template, delete trip PDF
(now hosted on Firebase Storage), gitignore service account key."
```

---

### Task 10: Run tests and type check

**Files:** None (verification only)

- [ ] **Step 1: Type check**

```bash
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 2: Run tests**

```bash
yarn test
```

Expected: all tests pass (weather tests are unaffected by these changes).

- [ ] **Step 3: Run lint**

```bash
yarn lint
```

Expected: clean.

---

### Task 11: Create PR

- [ ] **Step 1: Push branch**

```bash
git push origin feat/security-cleanup-pdf
```

- [ ] **Step 2: Create PR**

```bash
gh pr create --title "Security: remove personal data, add custom claims auth & PDF hosting" --body "$(cat <<'EOF'
## Summary

- Replace hardcoded family emails with Firestore collection `family`
- Replace email allowlist auth with Firebase custom claims (`familyMember`)
- Update Firestore/Storage security rules to use custom claims
- Host trip PDF on Firebase Storage, add download button in Infos page
- Add `scripts/set-claims.js` for managing family access
- Remove personal data from codebase and env template

## Manual steps after merge

1. Download service account key from Firebase Console → `scripts/service-account-key.json`
2. Run `node scripts/set-claims.js`
3. Deploy rules: `firebase deploy --only firestore:rules,storage`
4. Family members must sign out and sign back in

## Test plan

- [ ] Verify `family` collection exists in Firestore with 3 documents
- [ ] Verify PDF is accessible in Firebase Storage at `documents/carnet_canada_2026.pdf`
- [ ] Run custom claims script successfully
- [ ] Sign out and sign back in — verify access works
- [ ] Verify Infos page shows "Voir le carnet de voyage" button
- [ ] Verify PDF opens in new tab when clicked
- [ ] Verify new souvenir page loads family members for author selection
- [ ] Verify unauthorized user is rejected at login

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

### Task 12: Manual post-merge steps (user action)

After the PR is merged:

- [ ] **Step 1: Download service account key**

Firebase Console → Project Settings → Service Accounts → Generate New Private Key → save as `scripts/service-account-key.json`

- [ ] **Step 2: Run custom claims script**

```bash
node scripts/set-claims.js
```

Expected: 3 success messages.

- [ ] **Step 3: Deploy security rules**

```bash
firebase deploy --only firestore:rules,storage
```

- [ ] **Step 4: Test the app**

Sign out, sign back in. Verify everything works: login, infos PDF button, new souvenir creation.

- [ ] **Step 5: Remove VITE_ALLOWED_EMAILS from .env.local**

Edit `.env.local` and delete the `VITE_ALLOWED_EMAILS=...` line. It's no longer used.
