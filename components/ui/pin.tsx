import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const pinVariants = cva(
  'inline-flex items-center justify-center rounded-full font-extrabold flex-shrink-0',
  {
    variants: {
      letter: {
        A: 'bg-[oklch(0.65_0.17_145)] text-white shadow-[inset_0_-2px_0_0_oklch(0.50_0.17_145)]',
        B: 'bg-[oklch(0.70_0.15_80)] text-[oklch(0.22_0.020_250)] shadow-[inset_0_-2px_0_0_oklch(0.58_0.13_80)]',
        C: 'bg-[oklch(0.66_0.14_320)] text-white shadow-[inset_0_-2px_0_0_oklch(0.50_0.14_320)]',
      },
      size: {
        sm: 'w-5 h-5 text-[10px]',
        md: 'w-7 h-7 text-[13px]',
        lg: 'w-8 h-8 text-sm',
      },
    },
    defaultVariants: {
      letter: 'A',
      size: 'md',
    },
  }
)

interface PinProps extends VariantProps<typeof pinVariants> {
  letter: 'A' | 'B' | 'C'
  animate?: boolean
  className?: string
}

export function Pin({ letter, size, animate, className }: PinProps) {
  return (
    <span
      className={cn(
        pinVariants({ letter, size }),
        animate && 'animate-pin-attach',
        className
      )}
    >
      {letter}
    </span>
  )
}

export function priorityToLetter(priority: 1 | 2 | 3): 'A' | 'B' | 'C' {
  return priority === 1 ? 'A' : priority === 2 ? 'B' : 'C'
}
