'use client'

import { useState, useMemo } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { TimetableGrid } from '@/components/timetable/TimetableGrid'
import { useRealtimeTimetable } from '@/hooks/useRealtimeTimetable'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import type { TimetableSlot, EventDate } from '@/types'

interface TimetableSectionProps {
  eventId: string
  slug: string
  eventDates: EventDate[]
  initialSlots: TimetableSlot[]
  participantId: string
}

export function TimetableSection({
  eventId,
  slug,
  eventDates,
  initialSlots,
  participantId,
}: TimetableSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [mySlots, setMySlots] = useState<{ slot_start: string; slot_end: string }[]>([])

  const allSlots = useRealtimeTimetable(eventId, initialSlots)

  // Build heatmap matrix: key = "YYYY-MM-DD_HH:MM" → overlap count
  const { slotMatrix, totalParticipants } = useMemo(() => {
    const matrix: Record<string, number> = {}
    const participantSet = new Set<string>()

    for (const slot of allSlots) {
      participantSet.add(slot.participant_id)
      // slot_start format: "YYYY-MM-DDTHH:MM:00" or "YYYY-MM-DDTHH:MM:00.000Z"
      const dt = slot.slot_start.replace('Z', '').split('T')
      const date = dt[0]
      const time = dt[1]?.slice(0, 5) ?? ''
      if (date && time) {
        const key = `${date}_${time}`
        matrix[key] = (matrix[key] ?? 0) + 1
      }
    }

    return { slotMatrix: matrix, totalParticipants: participantSet.size }
  }, [allSlots])

  // Pre-populate my existing selections
  const myInitialSlotKeys = useMemo(() => {
    return initialSlots
      .filter((s) => s.participant_id === participantId)
      .map((s) => {
        const dt = s.slot_start.replace('Z', '').split('T')
        const date = dt[0]
        const time = dt[1]?.slice(0, 5) ?? ''
        return `${date}_${time}`
      })
  }, [initialSlots, participantId])

  async function handleSave() {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/events/${slug}/timetable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participant_id: participantId, slots: mySlots }),
      })
      if (!res.ok) {
        toast.error('저장에 실패했습니다')
        return
      }
      toast.success('가용 시간이 저장되었습니다')
    } catch {
      toast.error('네트워크 오류가 발생했습니다')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        render={<Button variant="outline" className="w-full justify-between" />}
      >
        <span>타임테이블 {isOpen ? '접기' : '펼치기'}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4 space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">전체 겹침 현황 (히트맵)</h3>
          <p className="text-xs text-muted-foreground">색이 진할수록 많은 사람이 가능한 시간입니다</p>
          <TimetableGrid
            mode="heatmap"
            eventDates={eventDates}
            slotMatrix={slotMatrix}
            totalParticipants={totalParticipants}
          />
        </div>

        <div className="border-t pt-4 space-y-2">
          <h3 className="text-sm font-medium">내 가용 시간 입력</h3>
          <p className="text-xs text-muted-foreground">드래그로 가능한 시간을 선택하세요</p>
          <TimetableGrid
            mode="edit"
            eventDates={eventDates}
            initialSelected={myInitialSlotKeys}
            onSelectionChange={setMySlots}
          />
          <Button onClick={handleSave} disabled={isSaving} size="sm" className="w-full">
            {isSaving ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
