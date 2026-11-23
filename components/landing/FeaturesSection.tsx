import { StickerCard } from '@/components/ui/sticker-card'

const FEATURES = [
  { t: '로그인 없음', s: '닉네임만 입력하면 바로 참여. 이메일·전화번호 없음.', tilt: 'l' as const, bg: 'chart1' as const },
  { t: '우선 옵션 핀', s: '생성자가 A·B·C 3개를 미리 제안. 참여자는 한 번에 투표.', tilt: 'r' as const, bg: 'chart2' as const },
  { t: '실시간 히트맵', s: '겹치는 시간이 자동으로 진해져요. 한눈에 답.', tilt: 'l' as const, bg: 'chart3' as const },
  { t: '대안 시간 제안', s: 'A·B·C 다 안 맞을 때, 누구나 새 시간을 제안.', tilt: 'r' as const, bg: 'chart4' as const },
  { t: '모바일 친화', s: '카톡 인앱 브라우저에서도 안 깨져요.', tilt: 'l' as const, bg: 'chart5' as const },
  { t: '무료 · 광고 없음', s: '약속이 끝나면 데이터는 자동 만료.', tilt: 'r' as const, bg: 'chart1' as const },
]

export function FeaturesSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-7">
        <div className="font-mono text-xs text-muted-foreground uppercase tracking-[0.08em] mb-2">기능</div>
        <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold m-0 tracking-tight">
          메모지처럼 가볍게, 시간표처럼 정확하게.
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f, i) => (
          <StickerCard key={f.t} tilt={f.tilt} hover bg={f.bg}>
            <div
              className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center font-mono text-[13px] font-bold mb-3.5"
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="text-[17px] font-bold mb-1">{f.t}</div>
            <div className="text-[13.5px] leading-[1.55]" style={{ color: 'oklch(0.30 0.020 250)' }}>
              {f.s}
            </div>
          </StickerCard>
        ))}
      </div>
    </section>
  )
}
