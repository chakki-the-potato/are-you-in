'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

// Key format: "YYYY-MM-DD_HH:MM"
function getDateFromKey(key: string): string {
  return key.split('_')[0]
}

interface DragState {
  isDragging: boolean
  startKey: string | null
  currentKey: string | null
  columnDate: string | null // drag is restricted to this date's column
  mode: 'select' | 'deselect'
}

interface UseDragSelectOptions {
  // All slot keys across all dates, grouped per date for range computation
  keysByDate: Record<string, string[]> // date → ["YYYY-MM-DD_HH:MM", ...]
  initialSelected?: Set<string>
  onCommit?: (selected: Set<string>) => void
}

function computeSelection(
  existing: Set<string>,
  drag: DragState,
  keysByDate: Record<string, string[]>
): Set<string> {
  if (!drag.startKey || !drag.currentKey || !drag.columnDate) return existing

  const colKeys = keysByDate[drag.columnDate] ?? []
  const startIdx = colKeys.indexOf(drag.startKey)
  const endIdx = colKeys.indexOf(drag.currentKey)
  if (startIdx === -1 || endIdx === -1) return existing

  const lo = Math.min(startIdx, endIdx)
  const hi = Math.max(startIdx, endIdx)
  const rangeKeys = colKeys.slice(lo, hi + 1)

  const next = new Set(existing)
  for (const key of rangeKeys) {
    if (drag.mode === 'select') next.add(key)
    else next.delete(key)
  }
  return next
}

export function useDragSelect({ keysByDate, initialSelected, onCommit }: UseDragSelectOptions) {
  const [selected, setSelected] = useState<Set<string>>(initialSelected ?? new Set())
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startKey: null,
    currentKey: null,
    columnDate: null,
    mode: 'select',
  })
  const dragStateRef = useRef(dragState)
  dragStateRef.current = dragState
  const selectedRef = useRef(selected)
  selectedRef.current = selected

  const handleMouseDown = useCallback((key: string) => {
    const mode = selectedRef.current.has(key) ? 'deselect' : 'select'
    setDragState({
      isDragging: true,
      startKey: key,
      currentKey: key,
      columnDate: getDateFromKey(key),
      mode,
    })
  }, [])

  const handleMouseEnter = useCallback((key: string) => {
    setDragState((prev) => {
      if (!prev.isDragging) return prev
      // Only allow drag within the same date column
      if (getDateFromKey(key) !== prev.columnDate) return prev
      return { ...prev, currentKey: key }
    })
  }, [])

  const handleMouseUp = useCallback(() => {
    setDragState((prev) => {
      if (!prev.isDragging) return prev
      const newSelected = computeSelection(selectedRef.current, prev, keysByDate)
      setSelected(newSelected)
      onCommit?.(newSelected)
      return { isDragging: false, startKey: null, currentKey: null, columnDate: null, mode: 'select' }
    })
  }, [keysByDate, onCommit])

  // Global mouseup to handle release outside grid
  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseUp])

  // Preview during drag
  const previewSelected = dragState.isDragging
    ? computeSelection(selected, dragState, keysByDate)
    : selected

  const setSelectedExternal = useCallback((next: Set<string>) => {
    setSelected(next)
  }, [])

  return {
    selected: previewSelected,
    isDragging: dragState.isDragging,
    handleMouseDown,
    handleMouseEnter,
    setSelected: setSelectedExternal,
  }
}
