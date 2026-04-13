import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CreateWizard } from '@/components/create/CreateWizard'

export default function CreatePage() {
  return (
    <main className="min-h-screen">
      <nav className="border-b">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">약속 만들기</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">새 약속 만들기</h1>
          <p className="text-sm text-muted-foreground mt-1">
            기본 정보, 날짜·시간, 타임테이블 순서로 입력하세요
          </p>
        </div>
        <CreateWizard />
      </div>
    </main>
  )
}
