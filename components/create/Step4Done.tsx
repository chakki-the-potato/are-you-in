'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Copy, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StickerCard } from '@/components/ui/sticker-card'
import { toast } from 'sonner'

interface Step4Props {
  slug: string
  title?: string
}

export function Step4Done({ slug, title }: Step4Props) {
  const [copied, setCopied] = useState(false)

  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/event/${slug}`
      : `/event/${slug}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('링크가 복사됐어요')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('복사 실패')
    }
  }

  return (
    <div className="text-center py-3">
      <div
        className="w-16 h-16 rounded-full inline-flex items-center justify-center mb-4 animate-pin-attach"
        style={{ background: 'var(--primary-soft)', color: 'var(--primary-strong)' }}
      >
        <Check className="size-7" />
      </div>
      <h3 className="text-[22px] font-extrabold mb-1.5">약속이 만들어졌어요</h3>
      <p className="text-muted-foreground text-[14.5px] mb-6">
        {title ? <>&quot;<strong>{title}</strong>&quot; — </> : null}아래 링크를 팀에 공유하세요.
      </p>

      <StickerCard bg="accent" tilt="none" className="flex items-center gap-2.5 p-3.5 text-left">
        <Share2 className="size-4 shrink-0" />
        <span className="font-mono flex-1 text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
          {url}
        </span>
        <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
          {copied ? (
            <>
              <Check className="size-3.5" /> 복사됨
            </>
          ) : (
            <>
              <Copy className="size-3.5" /> 복사
            </>
          )}
        </Button>
      </StickerCard>

      <div className="flex gap-2 justify-center mt-5 flex-wrap">
        <Link href="/" className="inline-block">
          <Button variant="outline">처음으로</Button>
        </Link>
        <Link href={`/event/${slug}`} className="inline-block">
          <Button className="gap-1.5">
            약속 페이지로 이동 <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
