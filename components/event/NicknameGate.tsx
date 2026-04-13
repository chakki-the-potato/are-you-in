'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface NicknameGateProps {
  slug: string
  onJoined: (participantId: string) => void
}

export function NicknameGate({ slug, onJoined }: NicknameGateProps) {
  const [nickname, setNickname] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [checked, setChecked] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`participant_${slug}`)
    if (stored) {
      onJoined(stored)
    }
    setChecked(true)
  }, [slug, onJoined])

  if (!checked) return null

  async function handleJoin() {
    if (!nickname.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/events/${slug}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim() }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? '참여에 실패했습니다')
        return
      }
      localStorage.setItem(`participant_${slug}`, json.participant_id)
      toast.success(`${nickname}(으)로 참여했습니다!`)
      onJoined(json.participant_id)
    } catch {
      toast.error('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border rounded-xl p-6 bg-muted/30 space-y-4">
      <div>
        <h3 className="font-semibold">참여하려면 닉네임을 입력하세요</h3>
        <p className="text-sm text-muted-foreground mt-1">로그인 없이 닉네임만으로 참여할 수 있어요</p>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 space-y-1">
          <Label htmlFor="nickname" className="sr-only">닉네임</Label>
          <Input
            id="nickname"
            placeholder="닉네임 입력"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            maxLength={50}
          />
        </div>
        <Button onClick={handleJoin} disabled={isLoading || !nickname.trim()}>
          {isLoading ? '참여 중...' : '참여하기'}
        </Button>
      </div>
    </div>
  )
}
