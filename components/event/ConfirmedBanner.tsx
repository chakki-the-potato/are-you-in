'use client'

import { Check } from 'lucide-react'
import type { TimeOption } from '@/types'

interface ConfirmedBannerProps {
  option: TimeOption
  onClear?: () => void
}

function formatKoreanDate(dateStr: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const d = new Date(`${dateStr}T00:00:00`)
  return `${d.getMonth() + 1}/${d.getDate()} (${days[d.getDay()]})`
}

function fmtTime(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

export function ConfirmedBanner({ option, onClear }: ConfirmedBannerProps) {
  return (
    <div
      className="bg-primary text-primary-foreground px-6 py-3.5 flex items-center gap-3"
      style={{ boxShadow: 'inset 0 -1px 0 var(--primary-strong)' }}
    >
      <Check className="size-[18px]" />
      <div className="font-bold text-[15px]">
        일정이 확정됐어요 — {formatKoreanDate(option.start_time.slice(0, 10))} {fmtTime(option.start_time)}–
        {fmtTime(option.end_time)}
      </div>
      {onClear && (
        <button
          onClick={onClear}
          className="ml-auto bg-transparent border border-[oklch(0.42_0.17_145)] text-inherit px-2.5 py-1 rounded-md text-[12.5px] font-semibold cursor-pointer hover:bg-[oklch(0.55_0.17_145)] transition-colors"
        >
          확정 취소
        </button>
      )}
    </div>
  )
}
