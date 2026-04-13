'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { AltSuggestion as AltSuggestionType } from '@/types'

interface AltSuggestionProps {
  slug: string
  participantId: string
  suggestions: AltSuggestionType[]
}

export function AltSuggestion({ slug, participantId, suggestions }: AltSuggestionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit() {
    if (!startDate || !startTime || !endTime) return
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
        toast.error('제안에 실패했습니다')
        return
      }
      toast.success('대안 시간을 제안했습니다')
      setIsOpen(false)
      setStartDate('')
      setStartTime('')
      setEndTime('')
      setNote('')
    } catch {
      toast.error('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">대안 시간 제안</h3>
          <ul className="space-y-2">
            {suggestions.map((s) => (
              <li key={s.id} className="border rounded-lg p-3 text-sm">
                <div className="flex gap-2">
                  <span>
                    {s.suggested_start.slice(0, 10)}{' '}
                    {s.suggested_start.slice(11, 16)} ~{' '}
                    {s.suggested_end.slice(11, 16)}
                  </span>
                </div>
                {s.note && <p className="text-muted-foreground mt-1">{s.note}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isOpen ? (
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          + 대안 시간 제안하기
        </Button>
      ) : (
        <div className="border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-medium">대안 시간 제안</h3>
          <div className="grid grid-cols-3 gap-2">
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
            placeholder="메모 (선택)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            rows={2}
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)} className="flex-1">
              취소
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={isLoading} className="flex-1">
              {isLoading ? '제안 중...' : '제안하기'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
