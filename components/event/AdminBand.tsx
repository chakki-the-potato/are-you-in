'use client'

import { Unlock } from 'lucide-react'

interface AdminBandProps {
  onExit: () => void
}

export function AdminBand({ onExit }: AdminBandProps) {
  return (
    <div
      className="px-6 py-2.5 flex items-center gap-2.5 text-[13px] font-semibold"
      style={{
        background: 'oklch(0.22 0.020 250)',
        color: 'oklch(0.97 0.012 95)',
      }}
    >
      <Unlock className="size-3.5" /> 관리자 모드
      <span className="font-normal" style={{ color: 'oklch(0.75 0.020 95)' }}>
        · 옵션 확정/재투표 가능
      </span>
      <button
        onClick={onExit}
        className="ml-auto bg-transparent border rounded-md px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors hover:bg-white/10"
        style={{
          borderColor: 'oklch(0.45 0.02 250)',
          color: 'oklch(0.97 0.012 95)',
        }}
      >
        나가기
      </button>
    </div>
  )
}
