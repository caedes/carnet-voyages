import type { Timestamp } from 'firebase/firestore'

export type Day = {
  id: string
  number: number
  date: string
  title: string
  subtitle: string
  distance: string
  duration: string
  location: {
    name: string
    lat: number
    lng: number
  }
  schedule: ScheduleItem[]
  routes: Route[]
  documents: TripDocument[]
  stages: string[]
  tips: string[]
}

export type ScheduleItem = {
  time: string
  label: string
  description?: string
}

export type Route = {
  from: string
  to: string
  distance: string
  duration: string
  googleMapsUrl: string
}

export type TripDocument = {
  icon: string
  label: string
  detail: string
  url: string
}

export type MediaItem = {
  filename: string
  type: 'photo' | 'video'
  originalUrl: string
  thumbnailUrl: string
  size: number
}

export type Memory = {
  id: string
  dayId: string
  stageLabel: string
  description: string
  authorEmail: string
  authorName: string
  media: MediaItem[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type FamilyMember = {
  email: string
  name: string
  initial: string
}

export type BudgetItem = {
  label: string
  amount: string
  status: 'confirmed' | 'estimated'
}

export type Contact = {
  icon: string
  label: string
  detail: string
  phone?: string
}
