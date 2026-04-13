'use client'

import { useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { Step1BasicInfo } from './Step1BasicInfo'
import { Step2DateRange } from './Step2DateRange'
import type { DateEntry } from './Step2DateRange'
import { Step4Done } from './Step4Done'

interface WizardState {
  // Step 1
  title: string
  description: string
  creator_nickname: string
  password: string
  min_participants: number
  // Step 2
  dates: DateEntry[]
  // Step 3 (done)
  result_slug: string
}

const STEP_LABELS = ['기본 정보', '날짜 & 시간', '완료']

export function CreateWizard() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<WizardState>({
    title: '',
    description: '',
    creator_nickname: '',
    password: '',
    min_participants: 2,
    dates: [],
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
          password: formData.password,
          min_participants: formData.min_participants,
          dates: formData.dates,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? '약속 생성에 실패했습니다')
        return
      }

      // Store participant_id for creator
      if (json.participant_id) {
        localStorage.setItem(`participant_${json.slug}`, json.participant_id)
      }

      updateForm({ result_slug: json.slug })
      setStep(3)
    } catch {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Step indicator */}
      {step < 3 && (
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEP_LABELS.slice(0, 2).map((label, i) => (
              <span key={i} className={step === i + 1 ? 'text-primary font-medium' : ''}>
                {i + 1}. {label}
              </span>
            ))}
          </div>
          <Progress value={(step / 2) * 100} className="h-1.5" />
        </div>
      )}

      {/* Step content */}
      {step === 1 && (
        <Step1BasicInfo
          data={formData}
          onChange={updateForm}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <>
          <Step2DateRange
            dates={formData.dates}
            onChange={(dates) => updateForm({ dates })}
            onNext={handleSubmit}
            onBack={() => setStep(1)}
          />
          {isSubmitting && (
            <p className="text-center text-sm text-muted-foreground mt-2">생성 중...</p>
          )}
          {error && (
            <p className="text-center text-sm text-destructive mt-2">{error}</p>
          )}
        </>
      )}

      {step === 3 && <Step4Done slug={formData.result_slug} />}
    </div>
  )
}
