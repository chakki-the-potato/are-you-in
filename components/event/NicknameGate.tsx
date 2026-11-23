'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StickerCard } from '@/components/ui/sticker-card'
import { toast } from 'sonner'

interface NicknameGateProps {
  slug: string
  onJoined: (participantId: string) => void
}

export function NicknameGate({ slug, onJoined }: NicknameGateProps) {
  const [nickname, setNickname] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`participant_${slug}`)
    if (stored) onJoined(stored)
    setChecked(true)
  }, [slug, onJoined])

  if (!checked) return null

  async function handleJoin() {
    if (!nickname.trim()) {
      toast.error('닉네임을 입력하세요')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/events/${slug}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim() }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? '참여에 실패했어요')
        return
      }
      localStorage.setItem(`participant_${slug}`, json.participant_id)
      toast.success(`반가워요, ${nickname.trim()}!`)
      onJoined(json.participant_id)
    } catch {
      toast.error('네트워크 오류가 발생했어요')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <StickerCard bg="accent" className="p-5">
      <div className="text-base font-bold mb-1">참여하려면 닉네임을 입력하세요</div>
      <div className="text-[13px] mb-3" style={{ color: 'oklch(0.30 0.020 250)' }}>
        가입 없이 한 번만. 같은 이름이면 다시 같은 응답이 보여요.
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleJoin()
        }}
        className="flex gap-2"
      >
        <Input
          placeholder="예: 지원"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={50}
          autoFocus
        />
        <Button type="submit" disabled={isLoading || !nickname.trim()}>
          {isLoading ? '참여 중…' : '참여하기'}
        </Button>
      </form>
    </StickerCard>
  )
}
