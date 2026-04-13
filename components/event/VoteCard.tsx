'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { TimeOption, Vote } from '@/types'

const PRIORITY_LABEL = { 1: 'A', 2: 'B', 3: 'C' } as const

interface VoteCardProps {
  option: TimeOption
  votes: Vote[]
  participantId: string
  slug: string
  disabled?: boolean
}

export function VoteCard({ option, votes, participantId, slug, disabled }: VoteCardProps) {
  const myVote = votes.find((v) => v.participant_id === participantId && v.option_id === option.id)
  const [localResponse, setLocalResponse] = useState<'accept' | 'decline' | undefined>(
    myVote?.response
  )
  const [isLoading, setIsLoading] = useState(false)

  const acceptCount = votes.filter((v) => v.option_id === option.id && v.response === 'accept').length
  const declineCount = votes.filter((v) => v.option_id === option.id && v.response === 'decline').length

  const startTime = new Date(option.start_time)
  const endTime = new Date(option.end_time)
  const timeStr = `${startTime.getUTCHours().toString().padStart(2, '0')}:${startTime.getUTCMinutes().toString().padStart(2, '0')} ~ ${endTime.getUTCHours().toString().padStart(2, '0')}:${endTime.getUTCMinutes().toString().padStart(2, '0')}`

  async function handleVote(response: 'accept' | 'decline') {
    if (disabled || isLoading) return
    setIsLoading(true)
    const prev = localResponse
    setLocalResponse(response) // optimistic update

    try {
      const res = await fetch(`/api/events/${slug}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option_id: option.id, participant_id: participantId, response }),
      })
      if (!res.ok) {
        setLocalResponse(prev)
        toast.error('투표에 실패했습니다')
      }
    } catch {
      setLocalResponse(prev)
      toast.error('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  // Use local response for display counts (optimistic)
  const displayAccept = localResponse === 'accept' && !myVote?.response
    ? acceptCount + 1
    : localResponse !== 'accept' && myVote?.response === 'accept'
      ? acceptCount - 1
      : acceptCount
  const displayDecline = localResponse === 'decline' && !myVote?.response
    ? declineCount + 1
    : localResponse !== 'decline' && myVote?.response === 'decline'
      ? declineCount - 1
      : declineCount

  return (
    <div className="border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
            {PRIORITY_LABEL[option.priority]}
          </span>
          <span className="font-medium text-sm">{timeStr}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {option.start_time.slice(0, 10)}
        </Badge>
      </div>

      <div className="flex gap-2">
        <Button
          variant={localResponse === 'accept' ? 'default' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={() => handleVote('accept')}
          disabled={disabled || isLoading}
        >
          ✅ 가능 {displayAccept > 0 && <span className="ml-1 font-bold">{displayAccept}</span>}
        </Button>
        <Button
          variant={localResponse === 'decline' ? 'destructive' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={() => handleVote('decline')}
          disabled={disabled || isLoading}
        >
          ❌ 불가 {displayDecline > 0 && <span className="ml-1 font-bold">{displayDecline}</span>}
        </Button>
      </div>
    </div>
  )
}
