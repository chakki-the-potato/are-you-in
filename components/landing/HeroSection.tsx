import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* 배경 그라디언트 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.585 0.233 277.7 / 0.12), transparent)',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-20 text-center space-y-8">
        {/* 배지 */}
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
          style={{
            borderColor: 'oklch(0.585 0.233 277.7 / 0.3)',
            backgroundColor: 'oklch(0.585 0.233 277.7 / 0.08)',
            color: 'var(--primary)',
          }}
        >
          ✨ 로그인 없이 바로 시작
        </span>

        {/* 메인 타이틀 */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            팀 일정,{' '}
            <span className="text-primary">쉽게</span> 맞춰요
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            로그인 없이 닉네임 하나로
            <br className="sm:hidden" />
            {' '}투표·타임테이블까지
          </p>
        </div>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/create"
            className={cn(buttonVariants({ size: 'lg' }), 'px-8 text-base h-11')}
          >
            새 약속 만들기 →
          </Link>
          <Link
            href="#how-to"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'px-8 text-base h-11')}
          >
            사용법 보기
          </Link>
        </div>

        {/* 소셜 프루프 */}
        <p className="text-sm text-muted-foreground">
          이미 <span className="font-semibold text-foreground">수백 팀</span>이 사용 중
        </p>
      </div>
    </section>
  )
}
