import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FeedbackForm } from '@/components/feedback/FeedbackForm'

export const metadata: Metadata = {
  title: '피드백 — Are You In?',
  description: '서비스 개선을 위한 의견을 남겨주세요',
}

export default function FeedbackPage() {
  return (
    <main className="min-h-screen px-4 py-10 pb-20">
      <div className="max-w-xl mx-auto mb-5">
        <Link href="/" className="inline-block">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="size-3.5" /> 처음으로
          </Button>
        </Link>
      </div>

      <div className="max-w-xl mx-auto mb-7">
        <h1 className="text-[28px] font-extrabold tracking-tight mb-1.5">피드백 보내기</h1>
        <p className="text-muted-foreground text-[15px] leading-[1.55]">
          뭐든 좋아요. 짧아도 되고, 길어도 되고. 가입 안 해도 보낼 수 있어요.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <FeedbackForm />
      </div>
    </main>
  )
}
