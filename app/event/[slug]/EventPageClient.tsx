'use client'

import { useState } from 'react'
import { NicknameGate } from '@/components/event/NicknameGate'
import { OptionVotingSection } from '@/components/event/OptionVotingSection'
import { TimetableSection } from '@/components/event/TimetableSection'
import { AltSuggestion } from '@/components/event/AltSuggestion'
import { AdminPanel } from '@/components/event/AdminPanel'
import { Separator } from '@/components/ui/separator'
import type { EventPageData, Event, TimeOption } from '@/types'

interface EventPageClientProps {
  initialData: EventPageData
  slug: string
}

export function EventPageClient({ initialData, slug }: EventPageClientProps) {
  const [participantId, setParticipantId] = useState<string | null>(null)
  const [event, setEvent] = useState<Event>(initialData.event)
  const [options, setOptions] = useState<TimeOption[]>(initialData.options)

  function handleJoined(id: string) {
    setParticipantId(id)
  }

  return (
    <div className="space-y-8">
      {/* Admin button — always visible */}
      <div className="flex justify-end">
        <AdminPanel
          event={event}
          eventDates={initialData.eventDates}
          options={options}
          onEventUpdate={setEvent}
          onOptionsUpdate={setOptions}
        />
      </div>

      {/* Nickname gate */}
      {!participantId ? (
        <NicknameGate slug={slug} onJoined={handleJoined} />
      ) : (
        <>
          <Separator />

          {/* Option voting */}
          <OptionVotingSection
            eventId={event.id}
            slug={slug}
            options={options}
            initialVotes={initialData.votes}
            participantId={participantId}
            isConfirmed={event.status === 'confirmed'}
          />

          <Separator />

          {/* Timetable */}
          <TimetableSection
            eventId={event.id}
            slug={slug}
            eventDates={initialData.eventDates}
            initialSlots={initialData.slots}
            participantId={participantId}
          />

          <Separator />

          {/* Alt suggestions */}
          <AltSuggestion
            slug={slug}
            participantId={participantId}
            suggestions={initialData.altSuggestions}
          />
        </>
      )}
    </div>
  )
}
