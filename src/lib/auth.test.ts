import { describe, it, expect, vi } from 'vitest'
import { isFamilyMember } from './auth'
import type { User } from 'firebase/auth'

vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('./firebase', () => ({
  getFirebaseAuth: vi.fn(),
}))

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
