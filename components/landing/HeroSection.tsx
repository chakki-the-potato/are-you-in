import Link from 'next/link'
import { ArrowRight, Sparkle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StickerCard } from '@/components/ui/sticker-card'
import { Pin } from '@/components/ui/pin'

const AVATAR_PALETTE = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']
const AVATAR_LABELS = ['지', '재', '수', '다', '한']

export function HeroSection() {
  return (
    <section className="relative">
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-16 text-center space-y-7 relative">
        <Badge variant="accent" className="gap-1.5 text-[13px] h-7 px-3">
          <Sparkle className="size-3.5" /> 로그인 없이 바로 시작
        </Badge>

        <h1 className="text-[clamp(40px,7vw,76px)] font-extrabold tracking-tight leading-[1.05] text-balance">
          팀 일정,
          <br />
          <span
            className="inline-block px-1.5"
            style={{
              backgroundImage: 'linear-gradient(180deg, transparent 60%, var(--accent) 60%)',
            }}
          >
            쉽게 맞춰요.
          </span>
        </h1>

        <p className="text-[clamp(15px,2.2vw,19px)] text-muted-foreground max-w-[540px] mx-auto leading-relaxed">
          로그인 없이 닉네임 하나로 투표·타임테이블까지.
          <br />
          When2meet의 정보 밀도, 메모지의 친근함.
        </p>

        <div className="flex justify-center gap-2.5 flex-wrap">
          <Link
            href="/create"
            className={cn(buttonVariants({ size: 'lg' }), 'h-11 px-6 text-base gap-1.5')}
          >
            새 약속 만들기 <ArrowRight className="size-4" />
          </Link>
          <Link
            href="#how-to"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-11 px-6 text-base')}
          >
            사용법 보기
          </Link>
        </div>

        <div className="text-[13px] text-muted-foreground inline-flex items-center gap-2">
          <span className="flex">
            {AVATAR_PALETTE.map((bg, i) => (
              <span
                key={i}
                className="w-[22px] h-[22px] rounded-full border-2 border-background inline-flex items-center justify-center text-[11px] font-bold text-foreground"
                style={{ background: bg, marginLeft: i === 0 ? 0 : -7 }}
              >
                {AVATAR_LABELS[i]}
              </span>
            ))}
          </span>
          이미 수백 팀이 사용 중
        </div>

        {/* Floating stickers — md+ */}
        <div className="hidden md:block absolute top-[80px] left-[30px] -rotate-6 z-0 pointer-events-none">
          <StickerCard bg="chart1" className="w-[180px] p-3.5">
            <div className="text-[11px] font-bold mb-1 font-mono" style={{ color: 'oklch(0.30 0.06 75)' }}>
              6/5 (목)
            </div>
            <div className="text-base font-bold" style={{ color: 'oklch(0.22 0.020 250)' }}>
              14:00 — 16:00
            </div>
            <div className="mt-2.5 flex items-center gap-1.5">
              <Pin letter="A" size="sm" />
              <span className="text-xs" style={{ color: 'oklch(0.30 0.06 75)' }}>
                가능 5 · 불가 2
              </span>
            </div>
          </StickerCard>
        </div>
        <div className="hidden md:block absolute top-[140px] right-[40px] rotate-[5deg] z-0 pointer-events-none">
          <StickerCard bg="chart3" className="w-[200px] p-3.5">
            <div className="text-[11px] font-semibold mb-1.5" style={{ color: 'oklch(0.30 0.06 240)' }}>
              &ldquo;다들 가능?&rdquo;
            </div>
            <div className="flex gap-1 mt-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-[18px] rounded-[3px]"
                  style={{ background: i < 4 ? 'var(--primary)' : 'oklch(0.93 0.02 240)' }}
                />
              ))}
            </div>
            <div className="mt-2 text-[11px]" style={{ color: 'oklch(0.30 0.06 240)' }}>
              4/6 응답
            </div>
          </StickerCard>
        </div>
      </div>
    </section>
  )
}
