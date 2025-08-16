'use client'

import { cn } from '@/lib/utils'
import { Flame } from 'lucide-react'

interface StreakBadgeProps {
  count: number
  className?: string
}

export function StreakBadge({ count, className }: StreakBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-600 dark:text-orange-400",
      className
    )}>
      <Flame className="h-4 w-4" />
      <span>{count} day{count !== 1 ? 's' : ''}</span>
    </div>
  )
}