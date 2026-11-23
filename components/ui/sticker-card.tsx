import { forwardRef, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const stickerCardVariants = cva(
  'rounded-[var(--radius)] border border-border bg-card text-card-foreground p-[18px] transition-[transform,box-shadow] duration-200 ease-out shadow-[var(--shadow-paper)]',
  {
    variants: {
      tilt: {
        none: '',
        l: '-rotate-[0.6deg]',
        r: 'rotate-[0.6deg]',
      },
      hover: {
        true: 'hover:rotate-0 hover:-translate-y-0.5 hover:shadow-[var(--shadow-paper-hover)]',
        false: '',
      },
      bg: {
        card: 'bg-card',
        accent: 'bg-accent border-[oklch(0.78_0.12_80)]',
        primarySoft: 'bg-primary-soft border-[oklch(0.85_0.08_145)]',
        chart1: 'bg-chart-1',
        chart2: 'bg-chart-2',
        chart3: 'bg-chart-3',
        chart4: 'bg-chart-4',
        chart5: 'bg-chart-5',
      },
    },
    defaultVariants: {
      tilt: 'none',
      hover: false,
      bg: 'card',
    },
  }
)

interface StickerCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stickerCardVariants> {}

export const StickerCard = forwardRef<HTMLDivElement, StickerCardProps>(
  ({ className, tilt, hover, bg, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(stickerCardVariants({ tilt, hover, bg }), className)}
      {...props}
    />
  )
)
StickerCard.displayName = 'StickerCard'

export { stickerCardVariants }
