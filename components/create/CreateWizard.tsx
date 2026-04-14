'use client'

import { useState } from 'react'
import { Step1BasicInfo } from './Step1BasicInfo'
import { Step2DateRange } from './Step2DateRange'
import type { DateEntry } from './Step2DateRange'
import { Step3TimeOptions } from './Step3TimeOptions'
import type { TimeOptionDraft } from './Step3TimeOptions'
import { Step4Done } from './Step4Done'

interface WizardState {
  // Step 1
  title: string
  description: string
  creator_nickname: string
  // Step 2
  dates: DateEntry[]
  // Step 3
  time_options: TimeOptionDraft[]
  // Step 4 (done)
  result_slug: string
}

const STEP_LABELS = ['기본 정보', '날짜 & 시간', '시간 옵션', '완료']

export function CreateWizard() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<WizardState>({
    title: '',
    description: '',
    creator_nickname: '',
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
          dates: formData.dates,
          time_options: formData.time_options.length > 0 ? formData.time_options : undefined,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? '약속 생성에 실패했습니다')
        return
      }

      if (json.participant_id) {
        localStorage.setItem(`participant_${json.slug}`, json.participant_id)
      }

      updateForm({ result_slug: json.slug })
      setStep(4)
    } catch {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Step indicator */}
      {step < 4 && (
        <div className="mb-8 flex">
          {STEP_LABELS.slice(0, 3).map((label, i) => {
            const isActive = step === i + 1
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className={`text-xs ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {i + 1}. {label}
                </span>
                <div className={`h-1.5 w-full rounded-full ${isActive ? 'bg-primary' : 'bg-transparent'}`} />
              </div>
            )
          })}
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
        <Step2DateRange
          dates={formData.dates}
          onChange={(dates) => updateForm({ dates })}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <>
          <Step3TimeOptions
            dates={formData.dates}
            options={formData.time_options}
            onChange={(time_options) => updateForm({ time_options })}
            onNext={handleSubmit}
            onBack={() => setStep(2)}
          />
          {isSubmitting && (
            <p className="text-center text-sm text-muted-foreground mt-2">생성 중...</p>
          )}
          {error && (
            <p className="text-center text-sm text-destructive mt-2">{error}</p>
          )}
        </>
      )}

      {step === 4 && <Step4Done slug={formData.result_slug} />}
    </div>
  )
}
