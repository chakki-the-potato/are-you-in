'use client'

import { useRealtimeVotes } from '@/hooks/useRealtimeVotes'
import { VoteCard } from './VoteCard'
import type { TimeOption, Vote } from '@/types'

interface OptionVotingSectionProps {
  eventId: string
  slug: string
  options: TimeOption[]
  initialVotes: Vote[]
  participantId: string
}

export function OptionVotingSection({
  eventId,
  slug,
  options,
  initialVotes,
  participantId,
}: OptionVotingSectionProps) {
  const votes = useRealtimeVotes(eventId, initialVotes)

  if (options.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-6 border rounded-xl">
        아직 우선 옵션이 없습니다
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="font-semibold">우선 옵션 투표</h2>
      <div className="space-y-3">
        {options.map((option) => (
          <VoteCard
            key={option.id}
            option={option}
            votes={votes}
            participantId={participantId}
            slug={slug}
          />
        ))}
      </div>
    </div>
  )
}
