import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
}))

vi.mock('#/lib/firebase', () => ({
  getFirebaseDb: vi.fn(() => 'mocked-db'),
}))

import { getDocs } from 'firebase/firestore'
import { fetchFamilyMembers } from './family'

function mockSnapshot(docs: Array<{ email?: string; name?: string }>) {
  vi.mocked(getDocs).mockResolvedValue({
    docs: docs.map((data) => ({
      data: () => data,
    })),
  } as never)
}

describe('fetchFamilyMembers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns correctly mapped family members', async () => {
    mockSnapshot([
      { email: 'romain@test.com', name: 'Romain' },
      { email: 'cecilia@test.com', name: 'Cécilia' },
    ])

    const members = await fetchFamilyMembers()

    expect(members).toEqual([
      { email: 'romain@test.com', name: 'Romain', initial: 'R' },
      { email: 'cecilia@test.com', name: 'Cécilia', initial: 'C' },
    ])
  })

  it('defaults initial to ? when name is missing', async () => {
    mockSnapshot([{ email: 'unknown@test.com' }])

    const members = await fetchFamilyMembers()

    expect(members).toEqual([
      { email: 'unknown@test.com', name: undefined, initial: '?' },
    ])
  })

  it('returns empty array when no documents exist', async () => {
    mockSnapshot([])

    const members = await fetchFamilyMembers()

    expect(members).toEqual([])
  })
})
