'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface Step1Data {
  title: string
  description: string
  creator_nickname: string
  password: string
  min_participants: number
}

interface Step1Props {
  data: Step1Data
  onChange: (data: Partial<Step1Data>) => void
  onNext: () => void
}

export function Step1BasicInfo({ data, onChange, onNext }: Step1Props) {
  const isValid =
    data.title.trim().length > 0 &&
    data.creator_nickname.trim().length > 0 &&
    data.password.length >= 4 &&
    data.min_participants >= 2

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
        <Label htmlFor="min_participants">최소 참여 인원 *</Label>
        <Input
          id="min_participants"
          type="number"
          min={2}
          max={50}
          value={data.min_participants}
          onChange={(e) => onChange({ min_participants: Number(e.target.value) })}
        />
        <p className="text-xs text-muted-foreground">최소 {data.min_participants}명이 참여해야 확정할 수 있어요</p>
      </div>

      <div className="border-t pt-5 space-y-5">
        <p className="text-sm text-muted-foreground">생성자 정보</p>
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

        <div className="space-y-2">
          <Label htmlFor="password">관리자 비밀번호 * (4자 이상)</Label>
          <Input
            id="password"
            type="password"
            placeholder="약속 관리에 사용할 비밀번호"
            value={data.password}
            onChange={(e) => onChange({ password: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">약속 확정/수정 시 필요합니다. 잘 기억해두세요.</p>
        </div>
      </div>

      <Button onClick={onNext} disabled={!isValid} className="w-full">
        다음 →
      </Button>
    </div>
  )
}
