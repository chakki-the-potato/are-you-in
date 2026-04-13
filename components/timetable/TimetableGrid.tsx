'use client'

import { useMemo } from 'react'
import { generateTimeSlots } from '@/lib/utils/time'
import { useDragSelect } from './useDragSelect'
import { TimetableCell } from './TimetableCell'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { EventDate, SlotMatrix } from '@/types'

interface TimetableGridProps {
  mode: 'edit' | 'heatmap'
  eventDates: EventDate[]
  // Edit mode
  initialSelected?: string[]
  onSelectionChange?: (slots: { slot_start: string; slot_end: string }[]) => void
  // Heatmap mode
  slotMatrix?: SlotMatrix
  totalParticipants?: number
}

// Parse "HH:MM" → total minutes
function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

// Add 15 minutes to "HH:MM"
function addFifteen(t: string): string {
  const mins = toMinutes(t) + 15
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Show time label every 4 slots (1 hour)
function showLabel(idx: number): boolean {
  return idx % 4 === 0
}

export function TimetableGrid({
  mode,
  eventDates,
  initialSelected = [],
  onSelectionChange,
  slotMatrix = {},
  totalParticipants = 0,
}: TimetableGridProps) {
  // Compute union time range across all dates for Y-axis
  const { unionSlots, minStart } = useMemo(() => {
    if (eventDates.length === 0) return { unionSlots: [], minStart: '00:00' }
    const starts = eventDates.map((d) => d.range_start)
    const ends = eventDates.map((d) => d.range_end)
    const minStart = starts.reduce((a, b) => (a < b ? a : b))
    const maxEnd = ends.reduce((a, b) => (a > b ? a : b))
    return { unionSlots: generateTimeSlots(minStart, maxEnd), minStart }
  }, [eventDates])

  // Build per-date key lists for drag restriction
  // Key format: "YYYY-MM-DD_HH:MM"
  const keysByDate = useMemo(() => {
    const result: Record<string, string[]> = {}
    for (const ed of eventDates) {
      const dateSlots = generateTimeSlots(ed.range_start, ed.range_end)
      result[ed.date] = dateSlots.map((s) => `${ed.date}_${s}`)
    }
    return result
  }, [eventDates])

  // Build set of enabled keys per date for quick lookup
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

  return (
    <ScrollArea className="w-full">
      <div className="flex min-w-max">
        {/* Time axis */}
        <div className="flex flex-col w-14 flex-shrink-0 border-r border-border">
          <div className="h-8 border-b border-border" /> {/* header spacer */}
          {unionSlots.map((slot, idx) => (
            <div key={slot} className="h-6 flex items-start justify-end pr-1">
              {showLabel(idx) && (
                <span className="text-[10px] text-muted-foreground leading-none -mt-1">
                  {slot}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Date columns */}
        {eventDates.map((ed) => (
          <div key={ed.date} className="flex flex-col min-w-[80px] border-r border-border">
            {/* Column header */}
            <div className="h-8 border-b border-border flex items-center justify-center px-1">
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                {ed.date.slice(5)} {/* "MM-DD" */}
              </span>
            </div>

            {/* Cells */}
            {unionSlots.map((slot) => {
              const key = `${ed.date}_${slot}`
              const isDisabled = !enabledKeys.has(key)
              return (
                <TimetableCell
                  key={key}
                  slotKey={key}
                  mode={mode}
                  isSelected={selected.has(key)}
                  disabled={isDisabled}
                  overlapCount={slotMatrix[key] ?? 0}
                  totalParticipants={totalParticipants}
                  onMouseDown={mode === 'edit' && !isDisabled ? () => handleMouseDown(key) : undefined}
                  onMouseEnter={mode === 'edit' && !isDisabled ? () => handleMouseEnter(key) : undefined}
                />
              )
            })}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
