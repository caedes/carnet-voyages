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
