'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Step4Props {
  slug: string
}

export function Step4Done({ slug }: Step4Props) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const url = `${appUrl}/event/${slug}`

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    toast.success('링크가 복사되었습니다!')
  }

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <div className="text-4xl">🎉</div>
        <h2 className="text-xl font-semibold">약속이 만들어졌어요!</h2>
        <p className="text-sm text-muted-foreground">아래 링크를 복사해 팀원들에게 공유하세요</p>
      </div>

      <div className="flex gap-2">
        <Input value={url} readOnly className="text-sm" />
        <Button onClick={handleCopy} variant="outline">
          복사
        </Button>
      </div>

      <Link href={`/event/${slug}`} className={cn(buttonVariants(), 'w-full')}>
        약속 페이지로 이동 →
      </Link>
    </div>
  )
}
