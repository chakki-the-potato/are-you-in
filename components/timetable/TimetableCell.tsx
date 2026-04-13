'use client'

import { cn } from '@/lib/utils'


interface TimetableCellProps {
  slotKey: string
  mode: 'edit' | 'heatmap'
  isSelected?: boolean
  disabled?: boolean
  overlapCount?: number
  totalParticipants?: number
  onMouseDown?: () => void
  onMouseEnter?: () => void
  onClick?: () => void
}

function getHeatmapColor(count: number, total: number): string {
  if (total === 0 || count === 0) return ''
  const intensity = count / total
  const r = Math.round(255 - intensity * (255 - 99))
  const g = Math.round(255 - intensity * (255 - 102))
  const b = Math.round(255 - intensity * (255 - 241))
  return `rgb(${r},${g},${b})`
}

export function TimetableCell({
  slotKey,
  mode,
  isSelected,
  disabled = false,
  overlapCount = 0,
  totalParticipants = 0,
  onMouseDown,
  onMouseEnter,
  onClick,
}: TimetableCellProps) {
  if (mode === 'heatmap') {
    if (disabled) {
      return <div className="h-6 w-full border-b border-r border-border/40 bg-muted/30" />
    }
    const bgColor = getHeatmapColor(overlapCount, totalParticipants)
    return (
      <div
        className="h-6 w-full border-b border-r border-border/40 relative"
        style={{ backgroundColor: bgColor || undefined }}
        title={overlapCount > 0 ? `${overlapCount}명 가능` : undefined}
      />
    )
  }

  // Edit mode
  if (disabled) {
    return (
      <div
        data-slot={slotKey}
        className="h-6 w-full border-b border-r border-border/40 bg-muted/30 cursor-not-allowed"
      />
    )
  }

  return (
    <div
      data-slot={slotKey}
      className={cn(
        'h-6 w-full border-b border-r border-border/40 relative cursor-pointer select-none transition-colors',
        isSelected ? 'bg-indigo-500/80' : 'bg-white hover:bg-indigo-50'
      )}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    />
  )
}
