import { cn } from '@/utils/cn'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-gradient-to-r from-muted via-slate-100 to-muted bg-[length:200%_100%] dark:via-slate-800',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
