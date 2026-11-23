import { StickerCard } from '@/components/ui/sticker-card'

const REVIEWS = [
  { name: '지원', role: '독서모임 리더', body: '카톡에 링크 던지니까 다들 한 번에 투표하고 끝. When2meet 보다 5배는 빠름.' },
  { name: '재현', role: '대학생 팀플', body: '닉네임만 쓰면 되니까 멤버 모으는 마찰이 0. 시험기간엔 진짜 생명줄.' },
  { name: '수민', role: '회사 동호회', body: '우선 옵션 3개 미리 정해놓는 방식이 신의 한 수. 토론이 안 늘어져요.' },
  { name: '다은', role: '스터디 운영진', body: '히트맵 보면서 "여기 다 되네" 한 마디면 끝. 약속 잡는 회의가 사라짐.' },
  { name: '한결', role: '동아리 회장', body: '관리자 모드로 옵션 추가하기가 편해요. 회의록 따로 안 써도 됨.' },
  { name: '예린', role: '프리랜서 모임', body: '대안 시간 제안 기능 진짜 좋음. "이건 안 되는데" 한 번에 정리.' },
]

const BG_CYCLE = ['chart1', 'chart2', 'chart3', 'chart4', 'chart5', 'chart1'] as const

export function ReviewsSection() {
  const doubled = [...REVIEWS, ...REVIEWS]

  return (
    <section className="py-12 overflow-hidden" aria-label="사용자 후기">
      <div className="max-w-5xl mx-auto px-4 mb-7">
        <div className="font-mono text-xs text-muted-foreground uppercase tracking-[0.08em] mb-2">리뷰</div>
        <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold m-0 tracking-tight">팀이 직접 말해요.</h2>
      </div>
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
          style={{ background: 'linear-gradient(to right, var(--background), transparent)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
          style={{ background: 'linear-gradient(to left, var(--background), transparent)' }}
        />
        <div className="flex gap-4 animate-marquee py-3" style={{ width: 'max-content' }}>
          {doubled.map((r, i) => (
            <StickerCard
              key={i}
              tilt={i % 2 === 0 ? 'l' : 'r'}
              bg={BG_CYCLE[i % BG_CYCLE.length]}
              className="min-w-[280px] max-w-[280px] p-[18px]"
            >
              <div className="text-sm leading-[1.55] mb-3.5" style={{ color: 'oklch(0.22 0.020 250)' }}>
                &ldquo;{r.body}&rdquo;
              </div>
              <div className="flex items-center gap-2.5 text-[12.5px]">
                <div className="w-7 h-7 rounded-full bg-card border border-border inline-flex items-center justify-center font-bold">
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-bold">{r.name}</div>
                  <div style={{ color: 'oklch(0.30 0.020 250)' }}>{r.role}</div>
                </div>
              </div>
            </StickerCard>
          ))}
        </div>
      </div>
    </section>
  )
}
