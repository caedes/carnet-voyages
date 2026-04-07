import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  getCountFromServer,
  serverTimestamp,
} from 'firebase/firestore'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getFirebaseDb } from './firebase'
import type { Memory, MediaItem } from '#/data/types'

function getMemoriesRef() {
  return collection(getFirebaseDb(), 'memories')
}

export function useMemoriesByDay(dayId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const q = query(getMemoriesRef(), where('dayId', '==', dayId), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Memory[]
      queryClient.setQueryData(['memories', dayId], memories)
    })
    return unsubscribe
  }, [dayId, queryClient])

  return useQuery<Memory[]>({
    queryKey: ['memories', dayId],
    queryFn: () => [],
    staleTime: Infinity,
  })
}

export function useAllMemories() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const q = query(getMemoriesRef(), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Memory[]
      queryClient.setQueryData(['memories', 'all'], memories)
    })
    return unsubscribe
  }, [queryClient])

  return useQuery<Memory[]>({
    queryKey: ['memories', 'all'],
    queryFn: () => [],
    staleTime: Infinity,
  })
}

export function useMemoriesCount() {
  return useQuery<number>({
    queryKey: ['memories', 'count'],
    queryFn: async () => {
      const snapshot = await getCountFromServer(query(getMemoriesRef()))
      return snapshot.data().count
    },
  })
}

type CreateMemoryInput = {
  dayId: string
  stageLabel: string
  description: string
  authorEmail: string
  authorName: string
  media: MediaItem[]
}

export function useCreateMemory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateMemoryInput) => {
      const docRef = await addDoc(getMemoriesRef(), {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['memories', variables.dayId] })
      queryClient.invalidateQueries({ queryKey: ['memories', 'all'] })
    },
  })
}
