import * as React from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'info'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        {
          'border-transparent bg-primary text-primary-foreground': variant === 'default',
          'border-transparent bg-secondary text-secondary-foreground': variant === 'secondary',
          'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300':
            variant === 'success',
          'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300':
            variant === 'warning',
          'border-transparent bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300':
            variant === 'danger',
          'border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300':
            variant === 'info',
          'border-border text-foreground': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
