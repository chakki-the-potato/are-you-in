'use client'

import { useState } from 'react'
import { Clock, MessageSquarePlus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { StickerCard } from '@/components/ui/sticker-card'
import { toast } from 'sonner'
import type { AltSuggestion as AltSuggestionType } from '@/types'

interface AltSuggestionProps {
  slug: string
  participantId: string
  suggestions: AltSuggestionType[]
}

function formatKoreanDate(dateStr: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const d = new Date(`${dateStr}T00:00:00`)
  return `${d.getMonth() + 1}/${d.getDate()} (${days[d.getDay()]})`
}

export function AltSuggestion({ slug, participantId, suggestions }: AltSuggestionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit() {
    if (!startDate || !startTime || !endTime) {
      toast.error('날짜와 시간을 입력하세요')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/events/${slug}/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: participantId,
          suggested_start: `${startDate}T${startTime}:00.000Z`,
          suggested_end: `${startDate}T${endTime}:00.000Z`,
          note: note || undefined,
        }),
      })
      if (!res.ok) {
        toast.error('제안에 실패했어요')
        return
      }
      toast.success('대안을 제안했어요')
      setIsOpen(false)
      setStartDate('')
      setStartTime('')
      setEndTime('')
      setNote('')
    } catch {
      toast.error('네트워크 오류가 발생했어요')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.08em]">
            대안 시간 제안 ({suggestions.length})
          </div>
          {suggestions.map((s) => (
            <StickerCard key={s.id} tilt="r" bg="chart3" className="p-3">
              <div className="flex gap-2 items-center text-[13.5px] font-bold">
                <Clock className="size-3.5" />
                {formatKoreanDate(s.suggested_start.slice(0, 10))} ·{' '}
                {s.suggested_start.slice(11, 16)} — {s.suggested_end.slice(11, 16)}
              </div>
              {s.note && (
                <div className="text-[12.5px] mt-1" style={{ color: 'oklch(0.30 0.020 250)' }}>
                  {s.note}
                </div>
              )}
            </StickerCard>
          ))}
        </div>
      )}

      {!isOpen ? (
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full justify-start gap-1.5"
        >
          <MessageSquarePlus className="size-3.5" /> 대안 시간 제안하기
        </Button>
      ) : (
        <StickerCard className="border-dashed p-3.5">
          <div className="text-[13.5px] font-bold mb-2.5">대안 시간 제안</div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="space-y-1">
              <Label htmlFor="alt-date" className="text-xs">날짜</Label>
              <Input id="alt-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="alt-start" className="text-xs">시작</Label>
              <Input id="alt-start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="alt-end" className="text-xs">종료</Label>
              <Input id="alt-end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          <Textarea
            placeholder="짧은 메모 (선택)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            rows={2}
          />
          <div className="flex gap-2 justify-end mt-2.5">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              취소
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? '제안 중…' : '제안하기'}
            </Button>
          </div>
        </StickerCard>
      )}
    </div>
  )
}
