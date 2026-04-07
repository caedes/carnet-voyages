import { useQuery } from '@tanstack/react-query'
import { collection, getDocs } from 'firebase/firestore'
import { getFirebaseDb } from '#/lib/firebase'
import type { FamilyMember } from './types'

export async function fetchFamilyMembers(): Promise<FamilyMember[]> {
  const db = getFirebaseDb()
  const snapshot = await getDocs(collection(db, 'family'))
  return snapshot.docs.map((doc) => ({
    email: doc.data().email,
    name: doc.data().name,
    initial: doc.data().name?.[0] ?? '?',
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
