export interface Participant {
  id: string
  name: string
  dateOfBirth: string // yyyy-mm-dd
  email: string
  phone: string
}

export type ParticipantFormData = Omit<Participant, 'id'>

export type SortField = 'name' | 'dateOfBirth' | null
export type SortDirection = 'asc' | 'desc'
