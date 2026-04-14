'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { TimePicker } from '@/components/ui/time-picker'
import { Plus, Trash2 } from 'lucide-react'
import type { DateEntry } from './Step2DateRange'

const PRIORITY_LABELS = { 1: 'A', 2: 'B', 3: 'C' } as const

export interface TimeOptionDraft {
  start_time: string // "YYYY-MM-DDTHH:MM:00"
  end_time: string
  priority: 1 | 2 | 3
}

interface Step3Props {
  dates: DateEntry[]
  options: TimeOptionDraft[]
  onChange: (options: TimeOptionDraft[]) => void
  onNext: () => void
  onBack: () => void
}

function formatKoreanDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-')
  return `${Number(m)}월 ${Number(d)}일`
}

function formatOptionDisplay(opt: TimeOptionDraft): string {
  const [datePart, timePart] = opt.start_time.split('T')
  const endTime = opt.end_time.split('T')[1]?.slice(0, 5) ?? ''
  const [, m, d] = datePart.split('-')
  return `${Number(m)}월 ${Number(d)}일 ${timePart?.slice(0, 5)} ~ ${endTime}`
}

export function Step3TimeOptions({ dates, options, onChange, onNext, onBack }: Step3Props) {
  const [newDate, setNewDate] = useState(dates[0]?.date ?? '')
  const [newStart, setNewStart] = useState('')
  const [newEnd, setNewEnd] = useState('')

  const selectedDateEntry = dates.find((d) => d.date === newDate)

  function handleAdd() {
    if (!newDate || !newStart || !newEnd || newStart >= newEnd) return
    if (options.length >= 3) return
    const nextPriority = (options.length + 1) as 1 | 2 | 3
    onChange([
      ...options,
      {
        start_time: `${newDate}T${newStart}:00`,
        end_time: `${newDate}T${newEnd}:00`,
        priority: nextPriority,
      },
    ])
    setNewStart('')
    setNewEnd('')
  }

  function handleRemove(idx: number) {
    const updated = options
      .filter((_, i) => i !== idx)
      .map((o, i) => ({ ...o, priority: (i + 1) as 1 | 2 | 3 }))
    onChange(updated)
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          참여자들이 투표할 시간 후보를 최대 3개 추가할 수 있어요. 건너뛰면 타임테이블만 사용합니다.
        </p>
      </div>

      {/* Added options */}
      {options.length > 0 && (
        <ul className="space-y-2">
          {options.map((opt, i) => (
            <li key={i} className="flex items-center gap-2 p-2 border rounded-lg text-sm">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex-shrink-0">
                {PRIORITY_LABELS[opt.priority]}
              </span>
              <span className="flex-1">{formatOptionDisplay(opt)}</span>
              <button
                onClick={() => handleRemove(i)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label="옵션 제거"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add form */}
      {options.length < 3 && (
        <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
          <p className="text-xs font-medium">옵션 추가</p>

          <div className="space-y-2">
            <Label className="text-xs">날짜</Label>
            <select
              value={newDate}
              onChange={(e) => {
                setNewDate(e.target.value)
                setNewStart('')
                setNewEnd('')
              }}
              className="w-full text-sm border rounded-md px-3 py-2 bg-background"
            >
              {dates.map((d) => (
                <option key={d.date} value={d.date}>
                  {formatKoreanDate(d.date)} ({d.range_start.slice(0, 5)}~{d.range_end.slice(0, 5)})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-1">
              <Label className="text-xs">시작</Label>
              <TimePicker value={newStart} onChange={setNewStart} />
            </div>
            <span className="text-muted-foreground text-sm mt-5">~</span>
            <div className="flex-1 space-y-1">
              <Label className="text-xs">종료</Label>
              <TimePicker value={newEnd} onChange={setNewEnd} />
            </div>
          </div>

          {newStart && newEnd && newStart >= newEnd && (
            <p className="text-xs text-destructive">종료 시간이 시작 시간보다 늦어야 합니다</p>
          )}

          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!newStart || !newEnd || newStart >= newEnd}
            className="w-full gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            추가
          </Button>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button variant="outline" onClick={onBack} className="flex-1">
          ← 이전
        </Button>
        <Button variant="outline" onClick={onNext} className="flex-1">
          건너뛰기
        </Button>
        <Button onClick={onNext} disabled={options.length === 0} className="flex-1">
          다음 →
        </Button>
      </div>
    </div>
  )
}
