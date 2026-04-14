'use client'

import { cn } from '@/lib/utils'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

const selectClass =
  'h-8 rounded-lg border border-input bg-transparent px-2 py-1 text-sm outline-none ' +
  'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ' +
  'disabled:pointer-events-none disabled:opacity-50 cursor-pointer'

interface TimePickerProps {
  value: string // "HH:MM"
  onChange: (value: string) => void
  className?: string
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hh, mm] = value ? value.split(':') : ['00', '00']

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <select
        value={hh}
        onChange={(e) => onChange(`${e.target.value}:${mm}`)}
        className={selectClass}
        aria-label="시"
      >
        {HOURS.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <span className="text-muted-foreground text-sm select-none">:</span>
      <select
        value={mm}
        onChange={(e) => onChange(`${hh}:${e.target.value}`)}
        className={selectClass}
        aria-label="분"
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  )
}
