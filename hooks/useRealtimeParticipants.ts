'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Participant } from '@/types'

export function useRealtimeParticipants(eventId: string, initialParticipants: Participant[]) {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`participants:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'participants',
          filter: `event_id=eq.${eventId}`,
        },
        (payload: RealtimePostgresChangesPayload<Participant>) => {
          setParticipants((prev) => [...prev, payload.new as Participant])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId])

  return participants
}
