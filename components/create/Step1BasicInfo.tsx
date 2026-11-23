'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface Step1Data {
  title: string
  description: string
  creator_nickname: string
  admin_password: string
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
    data.admin_password.trim().length >= 4

  return (
    <div className="grid gap-5">
      <div>
        <Label htmlFor="title" className="block text-[13px] font-semibold mb-1.5">
          약속 제목 <span className="text-destructive font-medium">*</span>
        </Label>
        <Input
          id="title"
          placeholder="예: 6월 독서모임"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          maxLength={100}
        />
      </div>

      <div>
        <Label htmlFor="description" className="block text-[13px] font-semibold mb-1.5">
          설명 <span className="text-muted-foreground font-medium text-xs">선택</span>
        </Label>
        <Textarea
          id="description"
          placeholder="간단한 설명을 적어주세요"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          maxLength={500}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="creator_nickname" className="block text-[13px] font-semibold mb-1.5">
          내 닉네임 <span className="text-destructive font-medium">*</span>
        </Label>
        <Input
          id="creator_nickname"
          placeholder="예: 지원"
          value={data.creator_nickname}
          onChange={(e) => onChange({ creator_nickname: e.target.value })}
          maxLength={50}
        />
        <div className="text-xs text-muted-foreground mt-1.5">생성자로 표시돼요. 나중에 못 바꿔요.</div>
      </div>

      <div>
        <Label htmlFor="admin_password" className="block text-[13px] font-semibold mb-1.5">
          관리자 비밀번호 <span className="text-destructive font-medium">*</span>
        </Label>
        <Input
          id="admin_password"
          type="password"
          placeholder="4자 이상"
          value={data.admin_password}
          onChange={(e) => onChange({ admin_password: e.target.value })}
          minLength={4}
          maxLength={20}
        />
        <div className="text-xs text-muted-foreground mt-1.5">
          나중에 일정 확정·재투표를 위해 필요해요. 잊지 마세요.
        </div>
      </div>

      <div className="flex justify-end mt-2">
        <Button onClick={onNext} disabled={!isValid} className="gap-1.5">
          다음 <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
