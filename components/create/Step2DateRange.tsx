'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { X } from 'lucide-react'

export interface DateEntry {
  date: string       // "YYYY-MM-DD"
  range_start: string // "HH:MM"
  range_end: string   // "HH:MM"
}

interface Step2Props {
  dates: DateEntry[]
  onChange: (dates: DateEntry[]) => void
  onNext: () => void
  onBack: () => void
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function toDisplayDate(str: string): string {
  const [y, m, d] = str.split('-')
  return `${y}년 ${Number(m)}월 ${Number(d)}일`
}

export function Step2DateRange({ dates, onChange, onNext, onBack }: Step2Props) {
  // For batch adding: default time range applied to newly selected dates
  const [defaultStart, setDefaultStart] = useState('09:00')
  const [defaultEnd, setDefaultEnd] = useState('18:00')

  const selectedSet = new Set(dates.map((d) => d.date))

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  function handleCalendarSelect(date: Date | undefined) {
    if (!date) return
    const str = toDateStr(date)
    if (selectedSet.has(str)) {
      // 이미 선택된 날짜 → 제거
      onChange(dates.filter((d) => d.date !== str))
    } else {
      // 새 날짜 추가 — 현재 기본 시간대 적용
      const newEntry: DateEntry = { date: str, range_start: defaultStart, range_end: defaultEnd }
      onChange([...dates, newEntry].sort((a, b) => a.date.localeCompare(b.date)))
    }
  }

  function updateEntry(index: number, field: 'range_start' | 'range_end', value: string) {
    const updated = [...dates]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  function removeEntry(index: number) {
    onChange(dates.filter((_, i) => i !== index))
  }

  const isValid =
    dates.length > 0 &&
    dates.every((d) => d.range_start < d.range_end)

  return (
    <div className="space-y-6">
      {/* 기본 시간대 (새로 선택 시 적용) */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">기본 시간대 (날짜 클릭 시 자동 적용)</Label>
        <div className="flex items-center gap-3">
          <Input
            type="time"
            value={defaultStart}
            onChange={(e) => setDefaultStart(e.target.value)}
            className="w-32"
          />
          <span className="text-muted-foreground text-sm">~</span>
          <Input
            type="time"
            value={defaultEnd}
            onChange={(e) => setDefaultEnd(e.target.value)}
            className="w-32"
          />
        </div>
      </div>

      {/* 달력 — 클릭으로 날짜 토글 */}
      <div className="space-y-2">
        <Label>날짜 선택 * (여러 날짜 클릭)</Label>
        <div className="border rounded-xl p-3 flex justify-center">
          <Calendar
            mode="single"
            selected={undefined}
            onSelect={handleCalendarSelect}
            disabled={(d) => d < today}
            modifiers={{ selected: (d) => selectedSet.has(toDateStr(d)) }}
            modifiersClassNames={{ selected: 'bg-primary text-primary-foreground rounded-md' }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          선택된 날짜 {dates.length}개 · 날짜를 다시 클릭하면 취소됩니다
        </p>
      </div>

      {/* 선택된 날짜 목록 — 날짜별 시간대 개별 조정 */}
      {dates.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">날짜별 시간대 조정</Label>
          <ul className="space-y-2">
            {dates.map((entry, i) => (
              <li key={entry.date} className="flex items-center gap-2 p-3 border rounded-lg">
                <span className="text-sm font-medium w-32 flex-shrink-0">
                  {toDisplayDate(entry.date)}
                </span>
                <Input
                  type="time"
                  value={entry.range_start}
                  onChange={(e) => updateEntry(i, 'range_start', e.target.value)}
                  className="w-28"
                />
                <span className="text-muted-foreground text-sm flex-shrink-0">~</span>
                <Input
                  type="time"
                  value={entry.range_end}
                  onChange={(e) => updateEntry(i, 'range_end', e.target.value)}
                  className="w-28"
                />
                {entry.range_start >= entry.range_end && (
                  <span className="text-xs text-destructive flex-shrink-0">시간 오류</span>
                )}
                <button
                  onClick={() => removeEntry(i)}
                  className="ml-auto text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  aria-label="날짜 제거"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          ← 이전
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="flex-1">
          약속 만들기
        </Button>
      </div>
    </div>
  )
}
