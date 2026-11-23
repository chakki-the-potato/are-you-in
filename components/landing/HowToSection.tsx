import { ChevronRight } from 'lucide-react'
import { StickerCard } from '@/components/ui/sticker-card'

const STEPS = [
  { n: '01', t: '약속 만들기', s: '제목·날짜·우선 옵션 입력. 1분.' },
  { n: '02', t: '링크 공유', s: '카톡·슬랙으로 한 번에.' },
  { n: '03', t: '닉네임으로 참여', s: '가입 없이 한 번 입력.' },
  { n: '04', t: '확정', s: '히트맵 보고 한 시간 픽.' },
]

export function HowToSection() {
  return (
    <section id="how-to" className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-7">
        <div className="font-mono text-xs text-muted-foreground uppercase tracking-[0.08em] mb-2">사용법</div>
        <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold m-0 tracking-tight">4단계면 끝.</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((s, i) => (
          <div key={s.n} className="relative">
            <StickerCard hover className="p-5">
              <div className="font-mono text-2xl font-bold text-primary mb-3">{s.n}</div>
              <div className="text-[17px] font-bold mb-1">{s.t}</div>
              <div className="text-[13.5px] text-muted-foreground leading-[1.55]">{s.s}</div>
            </StickerCard>
            {i < STEPS.length - 1 && (
              <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                <ChevronRight className="size-5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
