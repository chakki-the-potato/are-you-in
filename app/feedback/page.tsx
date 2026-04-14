import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FeedbackForm } from '@/components/feedback/FeedbackForm'

export const metadata: Metadata = {
  title: '피드백 — Are You In?',
  description: '서비스 개선을 위한 의견을 남겨주세요',
}

export default function FeedbackPage() {
  return (
    <main className="min-h-screen">
      <nav className="border-b">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">피드백</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">피드백 보내기</h1>
          <p className="text-sm text-muted-foreground mt-1">
            서비스 개선에 도움이 되는 의견을 남겨주세요. 모든 피드백을 읽습니다 🙏
          </p>
        </div>
        <FeedbackForm />
      </div>
    </main>
  )
}
