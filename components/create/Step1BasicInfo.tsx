'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface Step1Data {
  title: string
  description: string
  creator_nickname: string
}

interface Step1Props {
  data: Step1Data
  onChange: (data: Partial<Step1Data>) => void
  onNext: () => void
}

export function Step1BasicInfo({ data, onChange, onNext }: Step1Props) {
  const isValid =
    data.title.trim().length > 0 &&
    data.creator_nickname.trim().length > 0

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">약속 제목 *</Label>
        <Input
          id="title"
          placeholder="예: 팀 회식 날짜 정하기"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명 (선택)</Label>
        <Textarea
          id="description"
          placeholder="약속에 대한 설명을 입력하세요"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          maxLength={500}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="creator_nickname">닉네임 *</Label>
        <Input
          id="creator_nickname"
          placeholder="닉네임을 입력하세요"
          value={data.creator_nickname}
          onChange={(e) => onChange({ creator_nickname: e.target.value })}
          maxLength={50}
        />
      </div>

      <Button onClick={onNext} disabled={!isValid} className="w-full">
        다음 →
      </Button>
    </div>
  )
}
