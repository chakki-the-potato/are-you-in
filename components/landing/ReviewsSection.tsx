const REVIEWS = [
  {
    name: '민준',
    role: '대학교 스터디장',
    text: '카톡에서 날짜 조율하다 지쳐서 써봤는데, 10분 만에 일정 확정했어요 🙌',
  },
  {
    name: '서연',
    role: '직장 동료',
    text: '회원가입 없이 바로 투표 가능한 게 최고예요. 다들 부담 없이 참여해요.',
  },
  {
    name: '도현',
    role: '동아리 총무',
    text: '타임테이블 드래그 기능 덕분에 MT 날짜 잡는 게 이렇게 쉬울 줄 몰랐어요.',
  },
  {
    name: '지우',
    role: '프리랜서 팀장',
    text: '클라이언트랑 미팅 잡을 때 매번 쓰고 있어요. 링크 하나로 해결!',
  },
  {
    name: '현서',
    role: '취준 스터디',
    text: '실시간으로 업데이트되니까 스크린샷 찍어서 공유 안 해도 돼서 편해요.',
  },
  {
    name: '윤아',
    role: '요가 클래스 매니저',
    text: '회원들 다음 달 수업 스케줄 잡을 때 이거 씁니다. 너무 편해요!',
  },
  {
    name: '재원',
    role: '사이드 프로젝트 팀',
    text: '개발팀 주간 회의 시간 정할 때 딱이에요. 구글 폼보다 훨씬 빠릅니다.',
  },
  {
    name: '수빈',
    role: '밴드 보컬',
    text: '멤버 다섯 명 합주 날짜 잡는 게 이렇게 쉬운 거였다고요? 진작 알았으면.',
  },
]

function ReviewCard({ review }: { review: (typeof REVIEWS)[0] }) {
  return (
    <div className="shrink-0 w-72 rounded-2xl border bg-card p-5 space-y-3">
      <p className="text-sm leading-relaxed text-foreground">"{review.text}"</p>
      <div>
        <p className="text-sm font-semibold">{review.name}</p>
        <p className="text-xs text-muted-foreground">{review.role}</p>
      </div>
    </div>
  )
}

export function ReviewsSection() {
  const doubled = [...REVIEWS, ...REVIEWS]

  return (
    <section className="py-20 overflow-hidden" aria-label="사용자 후기">
      <div className="max-w-5xl mx-auto px-4 text-center space-y-3 mb-10">
        <h2 className="text-3xl font-bold">사용자 후기</h2>
        <p className="text-muted-foreground">실제 사용자들의 이야기</p>
      </div>

      <div className="relative">
        {/* 양 끝 페이드 마스크 */}
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

        {/* 마퀴 트랙 */}
        <div
          className="flex gap-4 animate-marquee"
          style={{ width: 'max-content' }}
        >
          {doubled.map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>
      </div>
    </section>
  )
}
