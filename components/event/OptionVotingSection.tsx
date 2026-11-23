'use client'

import { Check } from 'lucide-react'
import { useRealtimeVotes } from '@/hooks/useRealtimeVotes'
import { Badge } from '@/components/ui/badge'
import { VoteCard } from './VoteCard'
import { AdminActions } from './AdminActions'
import type { TimeOption, Vote } from '@/types'

interface OptionVotingSectionProps {
  eventId: string
  slug: string
  options: TimeOption[]
  initialVotes: Vote[]
  participantId: string
  confirmedOptionId: string | null
  adminToken: string | null
  onAdminConfirmed: (optionId: string) => void
  onAdminReset: () => void
  onSessionExpired: () => void
}

export function OptionVotingSection({
  eventId,
  slug,
  options,
  initialVotes,
  participantId,
  confirmedOptionId,
  adminToken,
  onAdminConfirmed,
  onAdminReset,
  onSessionExpired,
}: OptionVotingSectionProps) {
  const votes = useRealtimeVotes(eventId, initialVotes)

  if (options.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-6 border border-border rounded-xl">
        아직 우선 옵션이 없습니다
      </div>
    )
  }

  // Find current participant's nickname for the chip — we only have id; the parent could pass it,
  // but the design just shows a primary chip with the user's name. Use a generic "참여 중" chip.
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-[17px] font-bold m-0">투표하기</h2>
        <Badge variant="primary" className="gap-1 h-6 px-2.5">
          <Check className="size-3" /> 참여 중
        </Badge>
        <span className="ml-auto text-xs text-muted-foreground">우선 옵션 {options.length}개</span>
      </div>
      <div className="space-y-3">
        {options.map((o, i) => (
          <VoteCard
            key={o.id}
            option={o}
            votes={votes}
            participantId={participantId}
            slug={slug}
            tilt={i % 2 === 0 ? 'l' : 'r'}
            confirmed={confirmedOptionId === o.id}
            locked={!!confirmedOptionId}
          />
        ))}
      </div>
      {adminToken && !confirmedOptionId && (
        <AdminActions
          slug={slug}
          options={options}
          adminToken={adminToken}
          onSessionExpired={onSessionExpired}
          onConfirmed={onAdminConfirmed}
          onReset={onAdminReset}
        />
      )}
    </div>
  )
}
