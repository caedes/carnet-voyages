import { useQuery } from '@tanstack/react-query'
import type { Memory } from '#/data/types'

export function useMemoriesByDay(dayId: string) {
  return useQuery<Memory[]>({
    queryKey: ['memories', dayId],
    queryFn: async () => {
      return []
    },
  })
}
