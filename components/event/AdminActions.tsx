'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StickerCard } from '@/components/ui/sticker-card'
import { Pin, priorityToLetter } from '@/components/ui/pin'
import { toast } from 'sonner'
import type { TimeOption } from '@/types'

interface AdminActionsProps {
  slug: string
  options: TimeOption[]
  adminToken: string
  onSessionExpired: () => void
  onConfirmed: (optionId: string) => void
  onReset: () => void
}

export function AdminActions({
  slug,
  options,
  adminToken,
  onSessionExpired,
  onConfirmed,
  onReset,
}: AdminActionsProps) {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isResetting, setIsResetting] = useState(false)

  async function handleConfirm(optionId: string) {
    setPendingId(optionId)
    try {
      const res = await fetch(`/api/events/${slug}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ option_id: optionId }),
      })
      if (res.status === 401) {
        toast.error('관리자 세션이 만료됐어요. 다시 인증해주세요.')
        onSessionExpired()
        return
      }
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        toast.error(json.error ?? '확정에 실패했어요')
        return
      }
      const letter = priorityToLetter(options.find((o) => o.id === optionId)?.priority ?? 1)
      toast.success(`${letter}로 확정됐어요`)
      onConfirmed(optionId)
    } catch {
      toast.error('네트워크 오류가 발생했어요')
    } finally {
      setPendingId(null)
    }
  }

  async function handleReset() {
    setIsResetting(true)
    try {
      const res = await fetch(`/api/events/${slug}/confirm`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      if (res.status === 401) {
        toast.error('관리자 세션이 만료됐어요. 다시 인증해주세요.')
        onSessionExpired()
        return
      }
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        toast.error(json.error ?? '재투표 전환 실패')
        return
      }
      toast.success('재투표 상태로 돌아갔어요')
      onReset()
    } catch {
      toast.error('네트워크 오류가 발생했어요')
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <StickerCard
      className="border-dashed"
      style={{ background: 'oklch(0.97 0.005 250)', borderColor: 'var(--border-strong)' }}
    >
      <div className="text-[13px] font-bold mb-2">관리자 액션</div>
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => {
          const letter = priorityToLetter(o.priority)
          return (
            <Button
              key={o.id}
              size="sm"
              onClick={() => handleConfirm(o.id)}
              disabled={pendingId === o.id}
              className="gap-1.5"
            >
              <Pin letter={letter} size="sm" /> {letter}로 확정
            </Button>
          )
        })}
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={isResetting}
          className="gap-1.5"
        >
          <Trash2 className="size-3.5" /> 재투표
        </Button>
      </div>
    </StickerCard>
  )
}
