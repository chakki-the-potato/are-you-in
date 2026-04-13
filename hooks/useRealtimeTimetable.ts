'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { TimetableSlot } from '@/types'

export function useRealtimeTimetable(eventId: string, initialSlots: TimetableSlot[]) {
  const [slots, setSlots] = useState<TimetableSlot[]>(initialSlots)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`timetable:${eventId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'timetable_slots', filter: `event_id=eq.${eventId}` },
        (payload: RealtimePostgresChangesPayload<TimetableSlot>) => {
          if (payload.eventType === 'INSERT') {
            setSlots((prev) => [...prev, payload.new as TimetableSlot])
          } else if (payload.eventType === 'DELETE') {
            setSlots((prev) => prev.filter((s) => s.id !== (payload.old as TimetableSlot).id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId])

  return slots
}
