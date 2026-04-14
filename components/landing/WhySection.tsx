'use client'

import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const WHY_ITEMS = [
  {
    step: '01',
    title: '단순한 불편함에서 시작',
    body: '"다음 주 스터디 언제 돼?" 카톡방에서 날짜 조율하다 지쳐서 만들었습니다.',
  },
  {
    step: '02',
    title: '로그인이 왜 필요하죠?',
    body: '단 한 번의 모임을 위해 계정을 만드는 건 너무 번거롭습니다. 닉네임 하나면 충분해요.',
  },
  {
    step: '03',
    title: '드래그로 시간 선택',
    body: '언제 가능한지 직접 드래그해서 표시하면, 겹치는 시간이 바로 보입니다.',
  },
  {
    step: '04',
    title: '모두가 동시에 볼 수 있어야',
    body: '투표 결과가 실시간으로 모든 참여자에게 반영됩니다. 새로고침 없이.',
  },
]

function WhyCard({
  item,
  index,
}: {
  item: (typeof WHY_ITEMS)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${index * 120}ms` }}
      className={cn(
        'flex gap-5 p-6 rounded-2xl border bg-card',
        visible ? 'animate-fade-in-up' : 'opacity-0'
      )}
    >
      <span
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
        style={{
          backgroundColor: 'oklch(0.585 0.233 277.7 / 0.1)',
          color: 'var(--primary)',
        }}
      >
        {item.step}
      </span>
      <div className="space-y-1">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
      </div>
    </div>
  )
}

export function WhySection() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto space-y-3 text-center mb-12">
        <h2 className="text-3xl font-bold">왜 만들었나요?</h2>
        <p className="text-muted-foreground">복잡한 서비스가 아닌, 딱 필요한 것만 담은 도구</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {WHY_ITEMS.map((item, i) => (
          <WhyCard key={item.step} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
