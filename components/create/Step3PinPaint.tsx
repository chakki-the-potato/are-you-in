'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Sparkle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StickerCard } from '@/components/ui/sticker-card'
import { Pin } from '@/components/ui/pin'
import { Badge } from '@/components/ui/badge'
import { generateTimeSlots } from '@/lib/utils/time'
import { toast } from 'sonner'
import type { DateEntry } from './Step2DateRange'
import type { TimeOptionDraft } from './Step3TimeOptions'

interface Step3PinPaintProps {
  dates: DateEntry[]
  options: TimeOptionDraft[]
  onChange: (options: TimeOptionDraft[]) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting?: boolean
}

type Letter = 'A' | 'B' | 'C'

const PIN_BG: Record<Letter, string> = {
  A: 'oklch(0.65 0.17 145)',
  B: 'oklch(0.70 0.15 80)',
  C: 'oklch(0.66 0.14 320)',
}
const PIN_FG: Record<Letter, string> = {
  A: 'white',
  B: 'oklch(0.22 0.020 250)',
  C: 'white',
}

function fmtKoreanDate(date: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const d = new Date(`${date}T00:00:00`)
  return `${d.getMonth() + 1}/${d.getDate()} (${days[d.getDay()]})`
}

function nextLetter(used: Letter[]): Letter | null {
  const all: Letter[] = ['A', 'B', 'C']
  return all.find((L) => !used.includes(L)) ?? null
}

function pinsToOptions(pins: Record<string, Letter>): TimeOptionDraft[] {
  const priorityMap: Record<Letter, 1 | 2 | 3> = { A: 1, B: 2, C: 3 }
  return Object.entries(pins).map(([key, letter]) => {
    const [date, slot] = key.split('_')
    const [h, m] = slot.split(':').map(Number)
    const start = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    const endH = h + 1
    const end = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    return {
      start_time: `${date}T${start}:00`,
      end_time: `${date}T${end}:00`,
      priority: priorityMap[letter],
    }
  })
}

export function Step3PinPaint({ dates, options, onChange, onSubmit, onBack, isSubmitting }: Step3PinPaintProps) {
  const [painted, setPainted] = useState<Set<string>>(new Set())
  const [pins, setPins] = useState<Record<string, Letter>>({})
  const [paintMode, setPaintMode] = useState<'add' | 'remove' | null>(null)

  // Sync to parent options whenever pins change
  useEffect(() => {
    onChange(pinsToOptions(pins))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins])

  // Cleanup paint mode on global mouseup/touchend
  useEffect(() => {
    const stop = () => setPaintMode(null)
    window.addEventListener('mouseup', stop)
    window.addEventListener('touchend', stop)
    return () => {
      window.removeEventListener('mouseup', stop)
      window.removeEventListener('touchend', stop)
    }
  }, [])

  // Compute union slots across all dates
  const { unionSlots, perDateRange } = useMemo(() => {
    if (dates.length === 0) return { unionSlots: [] as string[], perDateRange: {} as Record<string, [string, string]> }
    const starts = dates.map((d) => d.range_start)
    const ends = dates.map((d) => d.range_end)
    const minStart = starts.reduce((a, b) => (a < b ? a : b))
    const maxEnd = ends.reduce((a, b) => (a > b ? a : b))
    const range: Record<string, [string, string]> = {}
    dates.forEach((d) => {
      range[d.date] = [d.range_start, d.range_end]
    })
    return { unionSlots: generateTimeSlots(minStart, maxEnd), perDateRange: range }
  }, [dates])

  function inRange(date: string, slot: string): boolean {
    const r = perDateRange[date]
    if (!r) return false
    return slot >= r[0] && slot < r[1]
  }

  function cellKey(date: string, slot: string) {
    return `${date}_${slot}`
  }

  function onCellDown(date: string, slot: string) {
    if (!inRange(date, slot)) return
    const k = cellKey(date, slot)
    const wasPainted = painted.has(k)
    setPaintMode(wasPainted ? 'remove' : 'add')
    setPainted((s) => {
      const n = new Set(s)
      if (wasPainted) {
        n.delete(k)
        // also remove pin if exists
        if (pins[k]) {
          setPins((p) => {
            const rest = { ...p }
            delete rest[k]
            return rest
          })
        }
      } else {
        n.add(k)
      }
      return n
    })
  }

  function onCellEnter(date: string, slot: string) {
    if (paintMode == null) return
    if (!inRange(date, slot)) return
    const k = cellKey(date, slot)
    setPainted((s) => {
      const n = new Set(s)
      if (paintMode === 'add') {
        n.add(k)
      } else {
        n.delete(k)
        if (pins[k]) {
          setPins((p) => {
            const rest = { ...p }
            delete rest[k]
            return rest
          })
        }
      }
      return n
    })
  }

  function onCellClick(date: string, slot: string) {
    const [, m] = slot.split(':').map(Number)
    if (m !== 0) return // only hour-tops
    const k = cellKey(date, slot)
    if (!painted.has(k)) {
      toast.error('먼저 가능한 시간을 칠해주세요')
      return
    }
    setPins((cur) => {
      if (cur[k]) {
        const rest = { ...cur }
        delete rest[k]
        return rest
      }
      const used = Object.values(cur)
      const letter = nextLetter(used)
      if (!letter) {
        toast.error('우선 옵션은 최대 3개까지')
        return cur
      }
      return { ...cur, [k]: letter }
    })
  }

  const pinCount = Object.keys(pins).length

  if (dates.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-6 border border-border rounded-xl">
        먼저 날짜를 선택해주세요
      </div>
    )
  }

  return (
    <div>
      <label className="block text-[13px] font-semibold mb-1.5">
        가능 시간을 칠하고, 핀을 꽂아주세요
      </label>
      <div className="text-[12.5px] text-muted-foreground mb-3.5 leading-[1.5]">
        드래그로 가능한 시간을 칠하세요. 그 위에 한 번 더 클릭하면 우선 옵션 핀(A·B·C)이 붙어요.{' '}
        <strong className="text-foreground">최대 3개</strong>까지.
      </div>

      <div
        className="border border-border rounded-[var(--radius-xs)] overflow-hidden bg-muted select-none"
        style={{ touchAction: 'none' }}
      >
        <div
          className="grid"
          style={{ gridTemplateColumns: `48px repeat(${dates.length}, minmax(0, 1fr))` }}
        >
          <div className="bg-card border-b border-border" />
          {dates.map((d) => (
            <div
              key={d.date}
              className="bg-card border-b border-l border-border px-1 py-2 text-[11.5px] font-bold text-center font-mono"
            >
              {fmtKoreanDate(d.date)}
            </div>
          ))}

          {unionSlots.map((slot, ri) => {
            const [, sm] = slot.split(':').map(Number)
            const isHourTop = sm === 0
            return (
              <div key={slot} className="contents">
                <div
                  className={`bg-card font-mono text-[10px] text-muted-foreground text-right pr-1.5 h-[18px] leading-[18px] ${
                    ri === 0 ? '' : 'border-t border-border'
                  } ${isHourTop ? 'opacity-100' : 'opacity-0'}`}
                >
                  {isHourTop ? slot : ''}
                </div>
                {dates.map((d) => {
                  const k = cellKey(d.date, slot)
                  const enabled = inRange(d.date, slot)
                  const sel = painted.has(k)
                  const pin = pins[k]
                  return (
                    <div
                      key={`${d.date}_${slot}`}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        onCellDown(d.date, slot)
                      }}
                      onMouseEnter={() => onCellEnter(d.date, slot)}
                      onTouchStart={(e) => {
                        e.preventDefault()
                        onCellDown(d.date, slot)
                      }}
                      onClick={(e) => {
                        if (e.detail === 1 && isHourTop && sel) {
                          onCellClick(d.date, slot)
                        }
                      }}
                      className="border-l border-border h-[18px] relative transition-colors duration-75"
                      style={{
                        background: !enabled
                          ? 'oklch(0.94 0.005 95)'
                          : sel
                            ? 'var(--primary-soft)'
                            : 'var(--card)',
                        cursor: enabled ? 'pointer' : 'not-allowed',
                        borderTop:
                          ri === 0
                            ? 'none'
                            : isHourTop
                              ? '1px solid var(--border)'
                              : '1px dashed oklch(0.94 0.010 95)',
                      }}
                    >
                      {pin && (
                        <span
                          className="absolute top-px left-0.5 z-[2] font-extrabold text-[10px] px-1.5 py-px rounded animate-pin-attach"
                          style={{ background: PIN_BG[pin], color: PIN_FG[pin] }}
                        >
                          {pin}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3.5 mt-3 flex-wrap text-xs">
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <span
            className="w-3.5 h-3.5 border border-primary rounded-[3px]"
            style={{ background: 'var(--primary-soft)' }}
          />
          가능 시간
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Pin letter="A" size="sm" /> 우선 옵션 (시간 정시 클릭)
        </span>
        <span className="ml-auto text-muted-foreground font-mono">핀 {pinCount}/3</span>
      </div>

      {pinCount > 0 && (
        <div className="mt-4">
          <div className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.08em] mb-2">
            우선 옵션 미리보기
          </div>
          <div className="grid gap-2">
            {Object.entries(pins)
              .sort((a, b) => a[1].localeCompare(b[1]))
              .map(([key, letter]) => {
                const [date, slot] = key.split('_')
                const [h, m] = slot.split(':').map(Number)
                const endH = h + 1
                return (
                  <StickerCard key={key} className="flex items-center gap-3 p-3" tilt="none">
                    <Pin letter={letter} />
                    <div className="font-mono text-sm font-semibold">
                      {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')} —{' '}
                      {String(endH).padStart(2, '0')}:{String(m).padStart(2, '0')}
                    </div>
                    <Badge variant="muted" className="ml-auto">
                      {fmtKoreanDate(date)}
                    </Badge>
                  </StickerCard>
                )
              })}
          </div>
        </div>
      )}

      <div className="flex justify-between gap-2 mt-7">
        <Button variant="outline" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="size-3.5" /> 이전
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting} className="gap-1.5">
          {isSubmitting ? '생성 중…' : <>약속 만들기 <Sparkle className="size-3.5" /></>}
        </Button>
      </div>

      {/* Suppress unused-import warning for options if not referenced */}
      <span className="hidden" aria-hidden>{options.length}</span>
    </div>
  )
}
