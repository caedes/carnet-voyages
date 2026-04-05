import type { FamilyMember } from './types'

export const FAMILY_MEMBERS: FamilyMember[] = [
  { email: import.meta.env.VITE_ALLOWED_EMAILS?.split(',')[0] ?? '', name: 'Romain', initial: 'R' },
  { email: import.meta.env.VITE_ALLOWED_EMAILS?.split(',')[1] ?? '', name: 'Maman', initial: 'M' },
  { email: import.meta.env.VITE_ALLOWED_EMAILS?.split(',')[2] ?? '', name: 'Lily', initial: 'L' },
]

export const ALLOWED_EMAILS = import.meta.env.VITE_ALLOWED_EMAILS?.split(',') ?? []

export function isEmailAllowed(email: string): boolean {
  return ALLOWED_EMAILS.includes(email)
}

export function getFamilyMember(email: string): FamilyMember | undefined {
  return FAMILY_MEMBERS.find((m) => m.email === email)
}
