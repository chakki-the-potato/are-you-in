'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Category = 'bug' | 'feature' | 'ux' | 'other'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'bug', label: '버그 신고' },
  { value: 'feature', label: '기능 제안' },
  { value: 'ux', label: 'UX 개선' },
  { value: 'other', label: '기타' },
]

export function FeedbackForm() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('feature')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
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
        toast.error(json.error ?? '제출에 실패했습니다')
        return
      }
      setDone(true)
      toast.success('피드백이 전달되었습니다. 감사합니다!')
    } catch {
      toast.error('네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="border rounded-2xl p-10 text-center space-y-4 bg-muted/30">
        <div className="text-4xl">🎉</div>
        <h3 className="font-semibold text-lg">피드백 감사합니다!</h3>
        <p className="text-sm text-muted-foreground">
          소중한 의견은 서비스 개선에 반영하겠습니다.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setDone(false)
            setMessage('')
            setName('')
            setCategory('feature')
          }}
        >
          다시 보내기
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 이름 (선택) */}
      <div className="space-y-1.5">
        <Label htmlFor="fb-name">이름 (선택)</Label>
        <Input
          id="fb-name"
          placeholder="홍길동"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
        />
      </div>

      {/* 카테고리 */}
      <div className="space-y-1.5">
        <Label>카테고리</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                category === c.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:bg-muted'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 메시지 */}
      <div className="space-y-1.5">
        <Label htmlFor="fb-message">
          내용 <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="fb-message"
          placeholder="자유롭게 의견을 남겨주세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          className="min-h-32"
          required
        />
        <p className="text-xs text-muted-foreground text-right">{message.length}/1000</p>
      </div>

      <Button type="submit" disabled={loading || !message.trim()} className="w-full">
        {loading ? '제출 중...' : '피드백 보내기'}
      </Button>
    </form>
  )
}
