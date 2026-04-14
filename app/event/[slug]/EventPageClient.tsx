'use client'

import { useState } from 'react'
import { EventHeader } from '@/components/event/EventHeader'
import { NicknameGate } from '@/components/event/NicknameGate'
import { OptionVotingSection } from '@/components/event/OptionVotingSection'
import { TimetableSection } from '@/components/event/TimetableSection'
import { AltSuggestion } from '@/components/event/AltSuggestion'
import { Separator } from '@/components/ui/separator'
import type { EventPageData } from '@/types'

interface EventPageClientProps {
  initialData: EventPageData
  slug: string
}

export function EventPageClient({ initialData, slug }: EventPageClientProps) {
  const [participantId, setParticipantId] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">

      {/* ── 왼쪽: 이벤트 정보 + 투표 ── */}
      <div className="space-y-6">
        <EventHeader
          event={initialData.event}
          eventDates={initialData.eventDates}
          participantCount={initialData.participants.length}
        />

        <Separator />

        {!participantId ? (
          <NicknameGate slug={slug} onJoined={setParticipantId} />
        ) : (
          <>
            <OptionVotingSection
              eventId={initialData.event.id}
              slug={slug}
              options={initialData.options}
              initialVotes={initialData.votes}
              participantId={participantId}
            />

            <Separator />
            <AltSuggestion
              slug={slug}
              participantId={participantId}
              suggestions={initialData.altSuggestions}
            />
          </>
        )}
      </div>

      {/* ── 오른쪽: 타임테이블 ── */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <TimetableSection
          eventId={initialData.event.id}
          slug={slug}
          eventDates={initialData.eventDates}
          initialSlots={initialData.slots}
          participantId={participantId}
        />
      </div>

    </div>
  )
}
