'use client'

import { useState, useMemo, useEffect } from 'react'
import { Edit3, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StickerCard } from '@/components/ui/sticker-card'
import { TimetableGrid } from '@/components/timetable/TimetableGrid'
import { useRealtimeTimetable } from '@/hooks/useRealtimeTimetable'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { TimetableSlot, EventDate, TimeOption } from '@/types'

interface TimetableSectionProps {
  eventId: string
  slug: string
  eventDates: EventDate[]
  initialSlots: TimetableSlot[]
  participantId: string | null
  options: TimeOption[]
  confirmedOptionId: string | null
}

export function TimetableSection({
  eventId,
  slug,
  eventDates,
  initialSlots,
  participantId,
  options,
  confirmedOptionId,
}: TimetableSectionProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [mySlots, setMySlots] = useState<{ slot_start: string; slot_end: string }[]>([])
  const [mode, setMode] = useState<'heatmap' | 'edit'>('heatmap')

  useEffect(() => {
    if (participantId) setMode('edit')
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
        toast.error('저장에 실패했어요')
        return
      }
      toast.success('가용 시간이 저장됐어요')
    } catch {
      toast.error('네트워크 오류가 발생했어요')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <StickerCard className="p-4 transform-none" tilt="none">
      <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
        <div>
          <div className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.08em]">
            타임테이블
          </div>
          <div className="text-[17px] font-bold">
            {mode === 'edit' ? '내 가능 시간 칠하기' : '전체 히트맵'}
          </div>
        </div>
        <SegmentedToggle mode={mode} setMode={setMode} canEdit={!!participantId} />
      </div>

      {mode === 'edit' && !participantId && (
        <div className="px-3.5 py-3 bg-muted border border-border rounded-[var(--radius-xs)] mb-3 text-[13px] text-muted-foreground">
          참여 후 본인 가능 시간을 칠할 수 있어요.
        </div>
      )}

      {mode === 'heatmap' ? (
        <TimetableGrid
          mode="heatmap"
          eventDates={eventDates}
          slotMatrix={slotMatrix}
          totalParticipants={totalParticipants}
          options={options}
          confirmedOptionId={confirmedOptionId}
        />
      ) : participantId ? (
        <div className="space-y-3">
          <TimetableGrid
            mode="edit"
            eventDates={eventDates}
            initialSelected={myInitialSlotKeys}
            onSelectionChange={setMySlots}
            options={options}
            confirmedOptionId={confirmedOptionId}
          />
          <Button onClick={handleSave} disabled={isSaving} size="sm" className="w-full">
            {isSaving ? '저장 중…' : '저장하기'}
          </Button>
        </div>
      ) : null}

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {mode === 'heatmap' ? (
          <>
            <span className="font-mono text-[11px] text-muted-foreground">1명</span>
            <div className="flex gap-0.5">
              {([1, 2, 3, 4, 5] as const).map((i) => (
                <div
                  key={i}
                  className="w-[22px] h-3 border border-border"
                  style={{ background: `var(--heat-${i})` }}
                />
              ))}
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              {totalParticipants > 0 ? `${totalParticipants}명 전원` : '전원'}
            </span>
            <span className="ml-auto text-[11.5px] text-muted-foreground">
              마우스 올리면 인원 보임
            </span>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="w-4 h-3.5 border border-primary rounded-[3px]"
                style={{ background: 'var(--primary-soft)' }}
              />
              내 가능 시간
            </span>
            <span className="ml-auto text-[11.5px] text-muted-foreground">드래그로 칠하기/지우기</span>
          </>
        )}
      </div>
    </StickerCard>
  )
}

interface SegmentedToggleProps {
  mode: 'heatmap' | 'edit'
  setMode: (m: 'heatmap' | 'edit') => void
  canEdit: boolean
}

function SegmentedToggle({ mode, setMode, canEdit }: SegmentedToggleProps) {
  return (
    <div className="inline-flex p-[3px] gap-0.5 rounded-[var(--radius-sm)] bg-muted border border-border">
      <button
        onClick={() => canEdit && setMode('edit')}
        disabled={!canEdit}
        className={cn(
          'inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-[var(--radius-xs)] transition-all duration-150',
          mode === 'edit'
            ? 'bg-card text-foreground border border-border'
            : 'bg-transparent text-muted-foreground border border-transparent',
          !canEdit && 'cursor-not-allowed opacity-50'
        )}
      >
        <Edit3 className="size-3" /> 편집
      </button>
      <button
        onClick={() => setMode('heatmap')}
        className={cn(
          'inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-[var(--radius-xs)] transition-all duration-150',
          mode === 'heatmap'
            ? 'bg-card text-foreground border border-border'
            : 'bg-transparent text-muted-foreground border border-transparent'
        )}
      >
        <Flame className="size-3" /> 히트맵
      </button>
    </div>
  )
}
