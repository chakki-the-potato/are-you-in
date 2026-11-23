'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Bug, MessageSquarePlus, Send, Sparkle } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { StickerCard } from '@/components/ui/sticker-card'
import { cn } from '@/lib/utils'

type Category = 'bug' | 'feature' | 'other'

const CATEGORIES: { value: Category; label: string; icon: React.ElementType; bg: string }[] = [
  { value: 'bug', label: '버그', icon: Bug, bg: 'var(--chart-4)' },
  { value: 'feature', label: '제안', icon: Sparkle, bg: 'var(--chart-2)' },
  { value: 'other', label: '기타', icon: MessageSquarePlus, bg: 'var(--chart-3)' },
]

export function FeedbackForm() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('feature')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) {
      toast.error('내용을 입력해주세요')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || null,
          category,
          message: message.trim(),
        }),
      })
      if (!res.ok) {
        const json = await res.json()
        toast.error(json.error ?? '제출에 실패했어요')
        return
      }
      setDone(true)
      toast.success('피드백 보냈어요. 고마워요!')
    } catch {
      toast.error('네트워크 오류가 발생했어요')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-16 px-4">
        <div
          className="w-[72px] h-[72px] rounded-full inline-flex items-center justify-center mb-4 animate-pin-attach"
          style={{ background: 'var(--primary-soft)', color: 'var(--primary-strong)' }}
        >
          <Send className="size-7" />
        </div>
        <h1 className="text-[26px] font-extrabold tracking-tight mb-2">고마워요!</h1>
        <p className="text-muted-foreground max-w-[380px] mx-auto leading-[1.6] mb-6">
          꼼꼼히 읽고 다음 업데이트에 반영할게요. 한 명이 보낸 의견이 모두에게 닿아요.
        </p>
        <Link href="/" className="inline-block">
          <Button className="gap-1.5">
            처음으로 <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <StickerCard tilt="none" className="p-6">
      <form onSubmit={handleSubmit} className="grid gap-[18px]">
        <div>
          <Label className="block text-[13px] font-semibold mb-1.5">카테고리</Label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((c) => {
              const Icon = c.icon
              const active = category === c.value
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={cn(
                    'rounded-[var(--radius-sm)] py-3.5 px-2.5 cursor-pointer transition-all duration-150 border text-foreground',
                    active ? 'border-primary' : 'border-border'
                  )}
                  style={{
                    background: active ? c.bg : 'var(--card)',
                    boxShadow: active ? 'var(--shadow-paper)' : 'none',
                    transform: active ? 'translateY(-1px)' : undefined,
                  }}
                >
                  <div className="mb-1 flex justify-center">
                    <Icon className="size-3.5" />
                  </div>
                  <div className="text-[13px] font-bold">{c.label}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="fb-message" className="block text-[13px] font-semibold mb-1.5">
            내용 <span className="text-destructive font-medium">*</span>
          </Label>
          <Textarea
            id="fb-message"
            placeholder="어떤 점이 좋았는지, 무엇이 불편했는지 자유롭게 적어주세요."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            className="min-h-[140px]"
            required
          />
        </div>

        <div>
          <Label htmlFor="fb-name" className="block text-[13px] font-semibold mb-1.5">
            닉네임 <span className="text-muted-foreground font-medium text-xs">선택</span>
          </Label>
          <Input
            id="fb-name"
            placeholder="익명으로 보내려면 비워두세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
          />
        </div>

        <div className="flex justify-end mt-1">
          <Button type="submit" disabled={loading || !message.trim()} className="gap-1.5">
            <Send className="size-3.5" /> {loading ? '제출 중…' : '피드백 보내기'}
          </Button>
        </div>
      </form>
    </StickerCard>
  )
}
