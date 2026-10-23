import { Button } from '@/components/ui/button'
import { Breadcrumb, type BreadcrumbItem } from '@/components/shared/Breadcrumb'
import { cn } from '@/utils/cn'

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6 space-y-3', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground md:text-base">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}

interface PageHeaderActionProps {
  label: string
  onClick?: () => void
  icon?: React.ReactNode
  variant?: 'default' | 'outline' | 'secondary'
}

export function PageHeaderAction({
  label,
  onClick,
  icon,
  variant = 'default',
}: PageHeaderActionProps) {
  return (
    <Button variant={variant} onClick={onClick}>
      {icon}
      {label}
    </Button>
  )
}
