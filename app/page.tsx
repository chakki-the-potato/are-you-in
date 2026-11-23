import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { ComparisonSection } from '@/components/landing/ComparisonSection'
import { HowToSection } from '@/components/landing/HowToSection'
import { ReviewsSection } from '@/components/landing/ReviewsSection'

export default function HomePage() {
  return (
    <main className="min-h-screen pb-16">
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5 border-b border-border"
        style={{
          background: 'oklch(0.97 0.012 95 / 0.85)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span className="font-extrabold text-[20px] tracking-tight">Are You In?</span>
        <Link
          href="/create"
          className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}
        >
          약속 만들기 <ArrowRight className="size-3.5" />
        </Link>
      </header>

      <HeroSection />
      <FeaturesSection />
      <ComparisonSection />
      <HowToSection />
      <ReviewsSection />

      <footer className="max-w-5xl mx-auto mt-10 px-6 py-6 border-t border-border flex items-center justify-between flex-wrap gap-3 text-[13px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-[15px] tracking-tight text-foreground">Are You In?</span>
          <span>© 2026</span>
        </div>
        <div className="flex gap-4">
          <Link href="/feedback" className="hover:text-foreground transition-colors">
            피드백 보내기
          </Link>
          <span>v0.1</span>
        </div>
      </footer>
    </main>
  )
}
