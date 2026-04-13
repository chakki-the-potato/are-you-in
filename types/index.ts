export type EventStatus = 'open' | 'closed'
export type VoteResponse = 'accept' | 'decline'

export interface Event {
  id: string
  title: string
  description: string | null
  creator_nickname: string
  slug: string
  status: EventStatus
  created_at: string
}

/** 날짜별 시간대 (복수 날짜 지원) */
export interface EventDate {
  id: string
  event_id: string
  date: string        // "YYYY-MM-DD"
  range_start: string // "HH:MM"
  range_end: string   // "HH:MM"
}

export interface Participant {
  id: string
  event_id: string
  nickname: string
  is_creator: boolean
  joined_at: string
}

export interface TimeOption {
  id: string
  event_id: string
  start_time: string
  end_time: string
  priority: 1 | 2 | 3
}

export interface Vote {
  id: string
  option_id: string
  participant_id: string
  response: VoteResponse
  voted_at: string
}

export interface TimetableSlot {
  id: string
  event_id: string
  participant_id: string
  slot_start: string
  slot_end: string
}

export interface AltSuggestion {
  id: string
  event_id: string
  participant_id: string
  suggested_start: string
  suggested_end: string
  note: string | null
  created_at: string
}

export interface DragState {
  isDragging: boolean
  startKey: string | null  // "YYYY-MM-DD_HH:MM"
  currentKey: string | null
  columnDate: string | null  // 드래그 중인 날짜 (다른 날짜로 넘어가지 않도록)
  mode: 'select' | 'deselect'
}

export interface SlotMatrix {
  [key: string]: number  // "YYYY-MM-DD_HH:MM" → overlap count
}

export interface EventPageData {
  event: Event
  eventDates: EventDate[]
  options: TimeOption[]
  participants: Participant[]
  votes: Vote[]
  slots: TimetableSlot[]
  altSuggestions: AltSuggestion[]
}
