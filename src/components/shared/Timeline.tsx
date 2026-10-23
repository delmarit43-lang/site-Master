import { Clock } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn } from '@/utils/cn'

export interface TimelineItem {
  id: string
  title: string
  description?: string
  date?: string
  status?: 'completed' | 'current' | 'upcoming' | 'cancelled'
}

interface TimelineProps {
  items?: TimelineItem[]
  className?: string
  emptyTitle?: string
  emptyDescription?: string
  /** @deprecated Prefer emptyTitle / emptyDescription */
  emptyMessage?: string
}

const statusDot: Record<NonNullable<TimelineItem['status']>, string> = {
  completed: 'bg-emerald-500 border-emerald-500',
  current: 'bg-primary border-primary ring-4 ring-primary/20',
  upcoming: 'bg-card border-muted-foreground/40',
  cancelled: 'bg-red-400 border-red-400',
}

export function Timeline({
  items = [],
  className,
  emptyTitle = 'No timeline events',
  emptyDescription = 'Timeline events will appear here once connected to the API.',
  emptyMessage,
}: TimelineProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyMessage ? emptyMessage : emptyTitle}
        description={emptyMessage ? 'Connect your API to populate timeline events.' : emptyDescription}
        icon={<Clock className="h-7 w-7" />}
        className={className}
      />
    )
  }

  return (
    <ol className={cn('relative space-y-0', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const status = item.status ?? 'upcoming'

        return (
          <li key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className="absolute left-[11px] top-6 h-[calc(100%-8px)] w-px bg-border"
                aria-hidden
              />
            )}
            <span
              className={cn(
                'relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                statusDot[status]
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-display text-sm font-semibold text-foreground">{item.title}</h4>
                {item.date && (
                  <time className="text-xs text-muted-foreground">{item.date}</time>
                )}
              </div>
              {item.description && (
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
