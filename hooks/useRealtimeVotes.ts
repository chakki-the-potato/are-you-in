'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Vote } from '@/types'

export function useRealtimeVotes(eventId: string, initialVotes: Vote[]) {
  const [votes, setVotes] = useState<Vote[]>(initialVotes)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`votes:${eventId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        (payload: RealtimePostgresChangesPayload<Vote>) => {
          if (payload.eventType === 'INSERT') {
            setVotes((prev) => [...prev, payload.new as Vote])
          } else if (payload.eventType === 'UPDATE') {
            setVotes((prev) =>
              prev.map((v) => (v.id === (payload.new as Vote).id ? (payload.new as Vote) : v))
            )
          } else if (payload.eventType === 'DELETE') {
            setVotes((prev) => prev.filter((v) => v.id !== (payload.old as Vote).id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId])

  return votes
}
