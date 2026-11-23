import { Check } from 'lucide-react'
import { StickerCard } from '@/components/ui/sticker-card'

const ROWS: { label: string; values: [boolean, boolean, boolean, boolean] }[] = [
  { label: '로그인 없음', values: [true, true, false, true] },
  { label: '타임테이블 시각화', values: [true, true, false, false] },
  { label: '우선 옵션 핀 투표', values: [true, false, true, true] },
  { label: '한국어 UX', values: [true, false, false, true] },
  { label: '모바일 가독성', values: [true, false, true, true] },
  { label: '실시간 동기화', values: [true, true, true, false] },
]

export function ComparisonSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-6">
        <div className="font-mono text-xs text-muted-foreground uppercase tracking-[0.08em] mb-2">
          왜 또 다른 일정 도구?
        </div>
        <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold m-0 tracking-tight">
          기존 도구의 빈자리를 메웠어요.
        </h2>
      </div>
      <StickerCard className="p-0 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="px-4 py-3.5 font-semibold text-[12.5px] text-muted-foreground uppercase tracking-[0.05em]"></th>
              <th className="px-4 py-3.5 font-bold text-sm">Are You In?</th>
              <th className="px-4 py-3.5 font-medium text-[13px] text-muted-foreground">When2meet</th>
              <th className="px-4 py-3.5 font-medium text-[13px] text-muted-foreground">Doodle</th>
              <th className="px-4 py-3.5 font-medium text-[13px] text-muted-foreground">카톡 투표</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-t border-border">
                <td className="px-4 py-3.5 font-semibold">{row.label}</td>
                {row.values.map((v, j) => (
                  <td
                    key={j}
                    className="px-4 py-3.5"
                    style={{ color: v ? 'var(--primary-strong)' : 'var(--muted-foreground)' }}
                  >
                    {v ? <Check className="size-[18px]" /> : <span>—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </StickerCard>
    </section>
  )
}
