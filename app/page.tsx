import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { WhySection } from '@/components/landing/WhySection'
import { HowToSection } from '@/components/landing/HowToSection'
import { ReviewsSection } from '@/components/landing/ReviewsSection'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg text-primary">Are You In?</span>
          <Link href="/create" className={cn(buttonVariants({ size: 'sm' }))}>
            약속 만들기
          </Link>
        </div>
      </nav>

      <HeroSection />
      <FeaturesSection />
      <WhySection />
      <HowToSection />
      <ReviewsSection />

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-5xl mx-auto px-4 py-8 flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2025 Are You In?</span>
          <Link href="/feedback" className="hover:text-foreground transition-colors">
            피드백 보내기
          </Link>
        </div>
      </footer>
    </main>
  )
}
