import { useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { getFirebaseAuth } from './firebase'
import { isEmailAllowed } from '#/data/family'

const provider = new GoogleAuthProvider()

export function signIn() {
  return signInWithPopup(getFirebaseAuth(), provider)
}

export function signOut() {
  return firebaseSignOut(getFirebaseAuth())
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
        if (!isEmailAllowed(user.email ?? '')) {
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
