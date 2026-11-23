'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar, Check, Sparkle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StickerCard } from '@/components/ui/sticker-card'
import { Pin, priorityToLetter } from '@/components/ui/pin'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { TimeOption, Vote } from '@/types'

interface VoteCardProps {
  option: TimeOption
  votes: Vote[]
  participantId: string
  slug: string
  tilt: 'l' | 'r'
  confirmed?: boolean
  locked?: boolean
}

function formatKoreanDate(dateStr: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const d = new Date(`${dateStr}T00:00:00`)
  return `${d.getMonth() + 1}/${d.getDate()} (${days[d.getDay()]})`
}

export function VoteCard({ option, votes, participantId, slug, tilt, confirmed, locked }: VoteCardProps) {
  const myVote = votes.find((v) => v.participant_id === participantId && v.option_id === option.id)
  const [localResponse, setLocalResponse] = useState<'accept' | 'decline' | undefined>(myVote?.response)
  const [isLoading, setIsLoading] = useState(false)
  const [pop, setPop] = useState(false)
  const popTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const acceptCount = votes.filter((v) => v.option_id === option.id && v.response === 'accept').length
  const declineCount = votes.filter((v) => v.option_id === option.id && v.response === 'decline').length

  const startTime = new Date(option.start_time)
  const endTime = new Date(option.end_time)
  const timeStr = `${String(startTime.getUTCHours()).padStart(2, '0')}:${String(startTime.getUTCMinutes()).padStart(2, '0')} — ${String(endTime.getUTCHours()).padStart(2, '0')}:${String(endTime.getUTCMinutes()).padStart(2, '0')}`

  const displayAccept =
    localResponse === 'accept' && !myVote?.response
      ? acceptCount + 1
      : localResponse !== 'accept' && myVote?.response === 'accept'
        ? acceptCount - 1
        : acceptCount
  const displayDecline =
    localResponse === 'decline' && !myVote?.response
      ? declineCount + 1
      : localResponse !== 'decline' && myVote?.response === 'decline'
        ? declineCount - 1
        : declineCount

  const totalVotes = displayAccept + displayDecline
  const acceptRatio = totalVotes > 0 ? Math.round((displayAccept / totalVotes) * 100) : 0

  useEffect(() => {
    setPop(true)
    if (popTimer.current) clearTimeout(popTimer.current)
    popTimer.current = setTimeout(() => setPop(false), 320)
    return () => {
      if (popTimer.current) clearTimeout(popTimer.current)
    }
  }, [displayAccept, displayDecline])

  async function handleVote(response: 'accept' | 'decline') {
    if (isLoading || locked) return
    setIsLoading(true)
    const prev = localResponse
    setLocalResponse(response)

    try {
      const res = await fetch(`/api/events/${slug}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option_id: option.id, participant_id: participantId, response }),
      })
      if (!res.ok) {
        setLocalResponse(prev)
        toast.error('투표에 실패했어요')
      }
    } catch {
      setLocalResponse(prev)
      toast.error('네트워크 오류가 발생했어요')
    } finally {
      setIsLoading(false)
    }
  }

  const letter = priorityToLetter(option.priority)

  return (
    <StickerCard
      tilt={confirmed ? 'none' : tilt}
      bg={confirmed ? 'primarySoft' : 'card'}
      className={cn(
        'p-4 space-y-3',
        confirmed && 'border-2 border-primary rotate-0'
      )}
    >
      <div className="flex items-center gap-2.5">
        <Pin letter={letter} />
        <div className="font-mono tabular-nums text-base font-bold">{timeStr}</div>
        <div className="ml-auto">
          <Badge variant="muted" className="gap-1 h-6 px-2.5">
            <Calendar className="size-3" />
            {formatKoreanDate(option.start_time.slice(0, 10))}
          </Badge>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-[width] duration-200"
            style={{ width: `${acceptRatio}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[12.5px] text-muted-foreground font-mono">
          <span>
            <span
              className={cn('font-bold text-primary-strong', pop && 'animate-count-pop')}
            >
              가능 {displayAccept}
            </span>
            <span className="mx-1.5">·</span>
            <span>불가 {displayDecline}</span>
          </span>
          <span>{acceptRatio}% · {totalVotes}명 응답</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={localResponse === 'accept' ? 'default' : 'outline'}
          onClick={() => handleVote('accept')}
          disabled={isLoading || locked}
          className="h-10"
        >
          <Check className="size-[15px]" /> 가능 {displayAccept}
        </Button>
        <Button
          variant={localResponse === 'decline' ? 'destructive' : 'outline'}
          onClick={() => handleVote('decline')}
          disabled={isLoading || locked}
          className="h-10"
        >
          <X className="size-[15px]" /> 불가 {displayDecline}
        </Button>
      </div>

      {confirmed && (
        <div className="text-[13px] font-bold text-primary-strong flex items-center gap-1.5 pt-1">
          <Sparkle className="size-3.5" /> 이 시간으로 확정됐어요
        </div>
      )}
    </StickerCard>
  )
}
