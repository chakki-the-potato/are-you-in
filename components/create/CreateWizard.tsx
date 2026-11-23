'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { StickerCard } from '@/components/ui/sticker-card'
import { Step1BasicInfo } from './Step1BasicInfo'
import { Step2DateRange } from './Step2DateRange'
import type { DateEntry } from './Step2DateRange'
import { Step3PinPaint } from './Step3PinPaint'
import type { TimeOptionDraft } from './Step3TimeOptions'
import { Step4Done } from './Step4Done'
import { cn } from '@/lib/utils'

interface WizardState {
  title: string
  description: string
  creator_nickname: string
  admin_password: string
  dates: DateEntry[]
  time_options: TimeOptionDraft[]
  result_slug: string
}

const STEPS = [
  { n: 1, label: '기본 정보' },
  { n: 2, label: '날짜 & 시간' },
  { n: 3, label: '시간 옵션' },
  { n: 4, label: '완료' },
] as const

interface StepIndicatorProps {
  step: number
}

function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-7">
      {STEPS.map((s, i) => {
        const completed = s.n < step
        const active = s.n === step
        const reached = s.n <= step
        return (
          <div key={s.n} className="contents">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  'w-7 h-7 rounded-full inline-flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 border transition-all duration-200',
                  reached
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-border'
                )}
              >
                {completed ? <Check className="size-3.5" /> : s.n}
              </div>
              <div
                className={cn(
                  'text-[12.5px] whitespace-nowrap hidden md:block',
                  active ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'
                )}
              >
                {s.label}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 transition-colors duration-200',
                  s.n < step ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function CreateWizard() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<WizardState>({
    title: '',
    description: '',
    creator_nickname: '',
    admin_password: '',
    dates: [],
    time_options: [],
    result_slug: '',
  })

  function updateForm(data: Partial<WizardState>) {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || undefined,
          creator_nickname: formData.creator_nickname,
          admin_password: formData.admin_password,
          dates: formData.dates,
          time_options: formData.time_options.length > 0 ? formData.time_options : undefined,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error?.message ?? json.error ?? '약속 생성에 실패했어요')
        return
      }

      if (json.participant_id) {
        localStorage.setItem(`participant_${json.slug}`, json.participant_id)
      }

      updateForm({ result_slug: json.slug })
      setStep(4)
    } catch {
      setError('네트워크 오류가 발생했어요')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {step < 4 && <StepIndicator step={step} />}

      <StickerCard tilt="none" className="p-7">
        {step === 1 && (
          <Step1BasicInfo
            data={formData}
            onChange={updateForm}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2DateRange
            dates={formData.dates}
            onChange={(dates) => updateForm({ dates })}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <>
            <Step3PinPaint
              dates={formData.dates}
              options={formData.time_options}
              onChange={(time_options) => updateForm({ time_options })}
              onSubmit={handleSubmit}
              onBack={() => setStep(2)}
              isSubmitting={isSubmitting}
            />
            {error && <p className="text-center text-sm text-destructive mt-2">{error}</p>}
          </>
        )}

        {step === 4 && <Step4Done slug={formData.result_slug} title={formData.title} />}
      </StickerCard>
    </div>
  )
}
