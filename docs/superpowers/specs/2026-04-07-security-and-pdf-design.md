# Security Cleanup & PDF Hosting

**Date:** 2026-04-07
**Status:** Draft

---

## Context

The repository is now **public** on GitHub. Personal data (family emails) must be removed from:
- Source code (`src/data/family.ts` via `VITE_ALLOWED_EMAILS`)
- Firebase security rules (`firestore.rules`, `storage.rules`)
- Environment variable template (`.env.example`)

The trip PDF (`docs/carnet_canada_2026_CLV_v3.pdf`) must be removed from the repo and hosted on Firebase Storage.

---

## 1. Family Members in Firestore

### Current state

- `VITE_ALLOWED_EMAILS` in `.env.local` contains 3 emails (comma-separated)
- `src/data/family.ts` splits this env var by index to build `FAMILY_MEMBERS` array with hardcoded names/initials
- Names are currently wrong: "Maman" and "Lily" should be "Cécilia" and "Julia"
- `src/lib/auth.ts` calls `isEmailAllowed()` to check access
- `src/routes/login.tsx` also calls `isEmailAllowed()` after sign-in

### Target state

- A Firestore collection `family` with 3 documents (created manually in Firebase Console):
  - `{ email: "laurentromain@gmail.com", name: "Romain", initial: "R" }`
  - `{ email: "cecilia.verrons@gmail.com", name: "Cécilia", initial: "C" }`
  - `{ email: "julia9laurent@gmail.com", name: "Julia", initial: "J" }`
- `src/data/family.ts` refactored to fetch from Firestore collection `family`
  - Expose a TanStack Query hook `useFamilyMembers()` returning the list
  - Expose `useFamilyMember(email)` for single lookups
  - Remove `FAMILY_MEMBERS` constant and `ALLOWED_EMAILS` constant
  - Remove `isEmailAllowed()` — authorization is now handled by custom claims (see section 2)
- All consumers updated to use the new hooks
- `VITE_ALLOWED_EMAILS` removed from `.env.local` and `.env.example`

### Consumers to update

1. **`src/lib/auth.ts`** — `useAuth()` currently calls `isEmailAllowed()`. Replace with custom claim check: after `onAuthStateChanged`, check `user.getIdTokenResult()` for `claims.familyMember === true`. If not set, sign out.
2. **`src/routes/login.tsx`** — `handleLogin()` calls `isEmailAllowed()`. Replace with custom claim check: after `signIn()`, get token result, check `claims.familyMember`.
3. **`src/routes/jour/$dayId_.souvenir.nouveau.tsx`** — imports `FAMILY_MEMBERS` for author selection. Replace with `useFamilyMembers()` hook. Handle loading state.

---

## 2. Firebase Custom Claims

### What

Each authorized user gets a custom claim `{ familyMember: true }` on their Firebase Auth profile. This is set via Firebase Admin SDK and persists until explicitly removed.

### Script: `scripts/set-claims.js`

A one-shot Node.js script using `firebase-admin`:

1. Initialize Firebase Admin with a service account key (downloaded from Firebase Console)
2. Read all documents from Firestore collection `family`
3. For each document, look up the user by email via `admin.auth().getUserByEmail(email)`
4. Set custom claim: `admin.auth().setCustomUserClaims(uid, { familyMember: true })`
5. Log success/failure for each user

**Prerequisites:**
- `firebase-admin` installed as devDependency
- Service account key JSON downloaded from Firebase Console → Project Settings → Service Accounts → Generate New Private Key
- Service account key stored at `scripts/service-account-key.json` (added to `.gitignore`)

**Usage:**
```bash
node scripts/set-claims.js
```

**Important:** After setting claims, users must sign out and sign back in for the new claims to take effect (or force a token refresh).

---

## 3. Security Rules Update

### Firestore rules (`firestore.rules`)

```rules
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

### Storage rules (`storage.rules`)

```rules
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

---

## 4. PDF on Firebase Storage

### Current state

- `docs/carnet_canada_2026_CLV_v3.pdf` (370KB) is in the repo
- No PDF display in the app
- The Infos page has budget, stats, contacts, and tips cards

### Target state

- PDF uploaded to Firebase Storage at `documents/carnet_canada_2026.pdf` (manually via Firebase Console or via script)
- PDF removed from `docs/` in the repo
- `docs/carnet_canada_2026_CLV_v3.pdf` added to `.gitignore`
- New card in the Infos page with a button "Voir le carnet de voyage" that:
  1. Calls `getDownloadURL()` for the Storage ref `documents/carnet_canada_2026.pdf`
  2. Opens the URL in a new browser tab (`window.open(url, '_blank')`)

### Implementation in Infos page

Add a new card at the top of the page (before Budget), using the same `cardStyle`:

```tsx
import { ref, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage } from '#/lib/firebase'
import { FilePdfOutlined } from '@ant-design/icons'

// In the component:
const handleOpenPdf = async () => {
  const storage = getFirebaseStorage()
  const pdfRef = ref(storage, 'documents/carnet_canada_2026.pdf')
  const url = await getDownloadURL(pdfRef)
  window.open(url, '_blank')
}
```

---

## 5. Scripts Documentation

### `scripts/README.md`

A short guide for managing family access, covering:

- **Prerequisites:** Node.js, `firebase-admin` (`yarn add -D firebase-admin`), service account key at `scripts/service-account-key.json`
- **How to get the service account key:** Firebase Console → Project Settings → Service Accounts → Generate New Private Key → save as `scripts/service-account-key.json`
- **Adding a new family member:**
  1. Add a document in the `family` collection via Firebase Console (fields: `email`, `name`, `initial`)
  2. Make sure the person has signed in at least once (so their Firebase Auth account exists)
  3. Run `node scripts/set-claims.js`
  4. The person must sign out and sign back in
- **Removing a family member:** Delete the document from the `family` collection. Optionally revoke claims via `admin.auth().setCustomUserClaims(uid, { familyMember: false })`

### Link from root README

Update the "Pour les développeurs" section in `README.md` to include a link to `scripts/README.md`:

```markdown
## Pour les développeurs

Voir [docs/TECHNICAL.md](docs/TECHNICAL.md) pour la documentation technique, [AGENTS.md](AGENTS.md) pour les conventions du projet, et [scripts/README.md](scripts/README.md) pour la gestion des accès famille.
```

---

## 6. Cleanup

- Remove `VITE_ALLOWED_EMAILS` from `.env.local`
- Remove `VITE_ALLOWED_EMAILS` line from `.env.example`
- Remove `docs/carnet_canada_2026_CLV_v3.pdf` from the repo
- Add `scripts/service-account-key.json` to `.gitignore`
- Remove the old `isEmailAllowed` and `getFamilyMember` functions from `src/data/family.ts`

---

## Implementation Order

1. **Manual (Firebase Console):** Create `family` collection with 3 documents
2. **Manual (Firebase Console):** Upload PDF to Storage at `documents/carnet_canada_2026.pdf`
3. Refactor `src/data/family.ts` to fetch from Firestore
4. Update auth (`src/lib/auth.ts`, `src/routes/login.tsx`) to use custom claims
5. Update souvenir page to use `useFamilyMembers()` hook
6. Add PDF card to Infos page
7. Update `firestore.rules` and `storage.rules`
8. Create `scripts/set-claims.js`
9. Create `scripts/README.md` with usage documentation
10. Update root `README.md` with link to scripts doc
11. Cleanup: remove env var, PDF file, update `.gitignore` and `.env.example`
12. All delivered as a PR (following the new branch+PR workflow)

### Manual steps after merge

- Download service account key from Firebase Console
- Run `node scripts/set-claims.js` to set custom claims
- Deploy Firestore/Storage rules: `firebase deploy --only firestore:rules,storage`
- Ask family members to sign out and sign back in
