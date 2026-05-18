import { BookOpen } from 'lucide-react'
import { APP_NAME } from '@/lib/brand'
import { cn } from '@/lib/utils'

interface BrandMarkProps {
  className?: string
  iconClassName?: string
  nameClassName?: string
  showName?: boolean
}

export function BrandMark({
  className,
  iconClassName,
  nameClassName,
  showName = true,
}: BrandMarkProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg bg-primary',
          iconClassName,
        )}
      >
        <BookOpen className="h-4 w-4 text-primary-foreground" />
      </div>
      {showName && (
        <span className={cn('text-lg font-semibold', nameClassName)}>{APP_NAME}</span>
      )}
    </div>
  )
}

