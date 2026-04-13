import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Calendar, Users, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="border-b">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg text-primary">Are You In?</span>
          <Link href="/create" className={cn(buttonVariants({ size: 'sm' }))}>
            약속 만들기
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-4 pt-20 pb-16 text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">팀 일정, 쉽게 맞춰요</h1>
          <p className="text-lg text-muted-foreground">
            로그인 없이 닉네임 하나로 투표·타임테이블까지
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Link href="/create" className={cn(buttonVariants({ size: 'lg' }), 'w-full max-w-md')}>
            새 약속 만들기 →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border rounded-xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Zap className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-sm">진입 장벽 제로</h3>
            <p className="text-xs text-muted-foreground">회원가입 없이 닉네임만 입력하면 바로 참여</p>
          </div>
          <div className="border rounded-xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-sm">타임테이블 투표</h3>
            <p className="text-xs text-muted-foreground">드래그로 가능한 시간대를 직접 선택</p>
          </div>
          <div className="border rounded-xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-sm">실시간 업데이트</h3>
            <p className="text-xs text-muted-foreground">투표 결과가 모두에게 즉시 반영</p>
          </div>
        </div>
      </section>
    </main>
  )
}
