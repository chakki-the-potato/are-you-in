import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateWizard } from '@/components/create/CreateWizard'

export default function CreatePage() {
  return (
    <main className="min-h-screen px-4 py-10 pb-20">
      <div className="max-w-xl mx-auto mb-5">
        <Link href="/" className="inline-block">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="size-3.5" /> 처음으로
          </Button>
        </Link>
      </div>

      <div className="max-w-xl mx-auto mb-7">
        <h1 className="text-[28px] font-extrabold tracking-tight mb-1.5">새 약속 만들기</h1>
        <p className="text-muted-foreground text-[15px]">1분이면 충분해요. 다 끝나면 링크가 나옵니다.</p>
      </div>

      <CreateWizard />
    </main>
  )
}
