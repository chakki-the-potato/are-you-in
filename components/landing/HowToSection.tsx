const STEPS = [
  {
    num: 1,
    icon: '📝',
    title: '약속 만들기',
    desc: '제목·날짜·시간 범위를 입력하고 링크를 복사합니다.',
  },
  {
    num: 2,
    icon: '🔗',
    title: '링크 공유',
    desc: '카카오톡, 슬랙, 어디서든 링크 하나로 친구를 초대합니다.',
  },
  {
    num: 3,
    icon: '👤',
    title: '닉네임으로 참여',
    desc: '초대받은 사람은 닉네임만 입력하면 바로 투표·타임테이블 입력 가능.',
  },
  {
    num: 4,
    icon: '✅',
    title: '결과 확인',
    desc: '모두의 응답이 모이면 겹치는 시간이 한눈에 보입니다.',
  },
]

export function HowToSection() {
  return (
    <section id="how-to" className="bg-muted/40">
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-bold">사용 방법</h2>
          <p className="text-muted-foreground">4단계로 끝납니다</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step) => (
            <div key={step.num} className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-background border flex items-center justify-center text-2xl shadow-sm">
                {step.icon}
              </div>
              <span className="text-xs font-bold text-primary">STEP {step.num}</span>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
