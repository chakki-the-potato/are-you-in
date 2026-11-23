'use client'

import { useMemo, useState } from 'react'
import { generateTimeSlots, timestampToSlot } from '@/lib/utils/time'
import { useDragSelect } from './useDragSelect'
import { TimetableCell } from './TimetableCell'
import { ScrollArea } from '@/components/ui/scroll-area'
import { priorityToLetter } from '@/components/ui/pin'
import type { EventDate, SlotMatrix, TimeOption } from '@/types'

interface TimetableGridProps {
  mode: 'edit' | 'heatmap'
  eventDates: EventDate[]
  // Edit mode
  initialSelected?: string[]
  onSelectionChange?: (slots: { slot_start: string; slot_end: string }[]) => void
  // Heatmap mode
  slotMatrix?: SlotMatrix
  totalParticipants?: number
  // Pin overlay
  options?: TimeOption[]
  confirmedOptionId?: string | null
}

function showLabel(idx: number): boolean {
  return idx % 4 === 0
}

function addFifteen(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const total = h * 60 + m + 15
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

interface TooltipState {
  x: number
  y: number
  date: string
  time: string
  count: number
}

export function TimetableGrid({
  mode,
  eventDates,
  initialSelected = [],
  onSelectionChange,
  slotMatrix = {},
  totalParticipants = 0,
  options = [],
  confirmedOptionId,
}: TimetableGridProps) {
  const { unionSlots } = useMemo(() => {
    if (eventDates.length === 0) return { unionSlots: [] as string[] }
    const starts = eventDates.map((d) => d.range_start)
    const ends = eventDates.map((d) => d.range_end)
    const minStart = starts.reduce((a, b) => (a < b ? a : b))
    const maxEnd = ends.reduce((a, b) => (a > b ? a : b))
    return { unionSlots: generateTimeSlots(minStart, maxEnd) }
  }, [eventDates])

  const keysByDate = useMemo(() => {
    const result: Record<string, string[]> = {}
    for (const ed of eventDates) {
      const dateSlots = generateTimeSlots(ed.range_start, ed.range_end)
      result[ed.date] = dateSlots.map((s) => `${ed.date}_${s}`)
    }
    return result
  }, [eventDates])

  const enabledKeys = useMemo(() => {
    const set = new Set<string>()
    for (const keys of Object.values(keysByDate)) {
      for (const k of keys) set.add(k)
    }
    return set
  }, [keysByDate])

  const initialSet = useMemo(() => new Set(initialSelected), [])

  const { selected, handleMouseDown, handleMouseEnter } = useDragSelect({
    keysByDate,
    initialSelected: initialSet,
    onCommit: (sel) => {
      if (!onSelectionChange) return
      const arr: { slot_start: string; slot_end: string }[] = []
      for (const key of sel) {
        const [date, time] = key.split('_')
        arr.push({
          slot_start: `${date}T${time}:00`,
          slot_end: `${date}T${addFifteen(time)}:00`,
        })
      }
      onSelectionChange(arr)
    },
  })

  // Build pin overlay map: key → {letter, isPinHead, optionId}
  const pinMap = useMemo(() => {
    const map: Record<string, { letter: 'A' | 'B' | 'C'; isPinHead: boolean; optionId: string }> = {}
    for (const opt of options) {
      const date = opt.start_time.slice(0, 10)
      const startSlot = timestampToSlot(opt.start_time)
      const endSlot = timestampToSlot(opt.end_time)
      const letter = priorityToLetter(opt.priority)
      const slots = generateTimeSlots(startSlot, endSlot)
      slots.forEach((s, idx) => {
        const key = `${date}_${s}`
        map[key] = { letter, isPinHead: idx === 0, optionId: opt.id }
      })
    }
    return map
  }, [options])

  const [tip, setTip] = useState<TooltipState | null>(null)

  function handleCellEnter(date: string, slot: string, key: string, e: React.MouseEvent<HTMLDivElement>) {
    if (mode === 'edit') {
      handleMouseEnter(key)
    } else if (mode === 'heatmap') {
      const count = slotMatrix[key] ?? 0
      if (count > 0) {
        const r = e.currentTarget.getBoundingClientRect()
        setTip({
          x: r.left + r.width / 2,
          y: r.top,
          date,
          time: slot,
          count,
        })
      }
    }
  }

  return (
    <div className="relative">
      <ScrollArea className="w-full">
        <div className="flex min-w-max">
          <div className="flex flex-col w-13 flex-shrink-0">
            <div className="h-9 border-b border-border" />
            {unionSlots.map((slot, idx) => (
              <div key={slot} className="h-[18px] flex items-start justify-end pr-1.5">
                {showLabel(idx) && (
                  <span className="font-mono text-[10.5px] text-muted-foreground leading-none">
                    {slot}
                  </span>
                )}
              </div>
            ))}
          </div>

          {eventDates.map((ed) => (
            <div key={ed.date} className="flex flex-col min-w-[80px] border-l border-border">
              <div className="h-9 border-b border-border flex items-center justify-center px-1">
                <span className="font-mono text-[12px] font-bold whitespace-nowrap">{ed.date.slice(5)}</span>
              </div>

              {unionSlots.map((slot) => {
                const key = `${ed.date}_${slot}`
                const isDisabled = !enabledKeys.has(key)
                const pin = pinMap[key]
                return (
                  <TimetableCell
                    key={key}
                    slotKey={key}
                    mode={mode}
                    isSelected={selected.has(key)}
                    disabled={isDisabled}
                    overlapCount={slotMatrix[key] ?? 0}
                    totalParticipants={totalParticipants}
                    pinLetter={pin?.letter ?? null}
                    isPinHead={pin?.isPinHead}
                    isConfirmed={!!pin && pin.optionId === confirmedOptionId}
                    onMouseDown={mode === 'edit' && !isDisabled ? () => handleMouseDown(key) : undefined}
                    onMouseEnter={
                      !isDisabled
                        ? (e) => handleCellEnter(ed.date, slot, key, e)
                        : undefined
                    }
                    onMouseLeave={mode === 'heatmap' ? () => setTip(null) : undefined}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      {tip && (
        <div
          className="fixed font-mono text-[11.5px] font-semibold pointer-events-none z-50 px-2 py-1 rounded-md whitespace-nowrap"
          style={{
            left: tip.x,
            top: tip.y - 8,
            transform: 'translate(-50%, -100%)',
            background: 'oklch(0.18 0.020 250)',
            color: 'oklch(0.97 0.012 95)',
          }}
        >
          {tip.date.slice(5)} {tip.time} · {tip.count}/{totalParticipants}명
        </div>
      )}
    </div>
  )
}
