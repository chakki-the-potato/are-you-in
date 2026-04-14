'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { TimetableGrid } from '@/components/timetable/TimetableGrid'
import { useRealtimeTimetable } from '@/hooks/useRealtimeTimetable'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { TimetableSlot, EventDate } from '@/types'

interface TimetableSectionProps {
  eventId: string
  slug: string
  eventDates: EventDate[]
  initialSlots: TimetableSlot[]
  participantId: string | null
}

export function TimetableSection({
  eventId,
  slug,
  eventDates,
  initialSlots,
  participantId,
}: TimetableSectionProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [mySlots, setMySlots] = useState<{ slot_start: string; slot_end: string }[]>([])
  const [activeTab, setActiveTab] = useState<'heatmap' | 'edit'>('heatmap')

  useEffect(() => {
    if (participantId) setActiveTab('edit')
  }, [participantId])

  const allSlots = useRealtimeTimetable(eventId, initialSlots)

  const { slotMatrix, totalParticipants } = useMemo(() => {
    const matrix: Record<string, number> = {}
    const participantSet = new Set<string>()

    for (const slot of allSlots) {
      participantSet.add(slot.participant_id)
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

  const myInitialSlotKeys = useMemo(() => {
    if (!participantId) return []
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
    <div>
      {/* 탭 헤더 */}
      <div className="flex border-b border-border mb-4">
        <button
          onClick={() => setActiveTab('heatmap')}
          className={cn(
            'flex-1 py-2 text-sm font-medium transition-colors',
            activeTab === 'heatmap'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          📊 전체 현황
        </button>
        <button
          onClick={() => participantId && setActiveTab('edit')}
          className={cn(
            'flex-1 py-2 text-sm font-medium transition-colors',
            activeTab === 'edit'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-muted-foreground',
            !participantId && 'cursor-not-allowed opacity-40'
          )}
          title={!participantId ? '닉네임을 입력해야 사용할 수 있습니다' : undefined}
        >
          ✏️ 내 일정{!participantId && <span className="ml-1 text-[10px]">🔒</span>}
        </button>
      </div>

      {/* 전체 현황 탭 */}
      {activeTab === 'heatmap' && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            색이 진할수록 많은 사람이 가능한 시간입니다
          </p>
          {totalParticipants === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/20">
              <span className="text-3xl mb-3">🕐</span>
              <p className="text-sm font-medium text-muted-foreground">
                아직 아무도 가용 시간을 입력하지 않았습니다
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                &apos;내 일정&apos; 탭에서 먼저 입력해 보세요
              </p>
            </div>
          ) : (
            <TimetableGrid
              mode="heatmap"
              eventDates={eventDates}
              slotMatrix={slotMatrix}
              totalParticipants={totalParticipants}
            />
          )}
        </div>
      )}

      {/* 내 일정 탭 */}
      {activeTab === 'edit' && participantId && (
        <div className="space-y-2">
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
      )}
    </div>
  )
}
