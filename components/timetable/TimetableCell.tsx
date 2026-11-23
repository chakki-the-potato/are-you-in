'use client'

import { cn } from '@/lib/utils'

interface TimetableCellProps {
  slotKey: string
  mode: 'edit' | 'heatmap'
  isSelected?: boolean
  disabled?: boolean
  overlapCount?: number
  totalParticipants?: number
  pinLetter?: 'A' | 'B' | 'C' | null
  isPinHead?: boolean
  isConfirmed?: boolean
  onMouseDown?: () => void
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave?: () => void
  onClick?: () => void
}

function heatBg(count: number, total: number): string | undefined {
  if (total === 0 || count === 0) return undefined
  const ratio = count / total
  if (ratio >= 0.95) return 'var(--heat-5)'
  if (ratio >= 0.75) return 'var(--heat-4)'
  if (ratio >= 0.5) return 'var(--heat-3)'
  if (ratio >= 0.25) return 'var(--heat-2)'
  return 'var(--heat-1)'
}

const PIN_BG: Record<'A' | 'B' | 'C', string> = {
  A: 'oklch(0.65 0.17 145)',
  B: 'oklch(0.70 0.15 80)',
  C: 'oklch(0.66 0.14 320)',
}
const PIN_FG: Record<'A' | 'B' | 'C', string> = {
  A: 'white',
  B: 'oklch(0.22 0.020 250)',
  C: 'white',
}

export function TimetableCell({
  slotKey,
  mode,
  isSelected,
  disabled = false,
  overlapCount = 0,
  totalParticipants = 0,
  pinLetter,
  isPinHead,
  isConfirmed,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: TimetableCellProps) {
  if (disabled) {
    return (
      <div className="h-[18px] w-full border-b border-r border-border bg-muted/40" />
    )
  }

  const heatColor = mode === 'heatmap' ? heatBg(overlapCount, totalParticipants) : undefined
  const bg =
    mode === 'heatmap'
      ? heatColor ?? 'var(--card)'
      : isSelected
        ? 'var(--primary-soft)'
        : 'var(--card)'

  return (
    <div
      data-slot={slotKey}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={cn(
        'h-[18px] w-full border-b border-r border-border relative select-none transition-colors',
        mode === 'edit' ? 'cursor-crosshair' : 'cursor-default'
      )}
      style={{ background: bg }}
    >
      {pinLetter && isPinHead && (
        <span
          className="absolute top-px left-0.5 z-[2] font-extrabold text-[10px] px-1.5 py-px rounded"
          style={{
            background: PIN_BG[pinLetter],
            color: PIN_FG[pinLetter],
          }}
        >
          {pinLetter}
        </span>
      )}
      {isConfirmed && pinLetter && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 2px var(--primary)' }}
        />
      )}
    </div>
  )
}
