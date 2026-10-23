import * as React from 'react'
import { cn } from '@/utils/cn'

interface FloatingFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const FloatingField = React.forwardRef<HTMLInputElement, FloatingFieldProps>(
  ({ className, label, error, id, placeholder = ' ', ...props }, ref) => {
    const fieldId = id ?? props.name
    return (
      <div className="relative">
        <input
          id={fieldId}
          ref={ref}
          placeholder={placeholder}
          className={cn(
            'peer h-14 w-full rounded-2xl border border-input bg-card px-4 pt-5 pb-2 text-sm text-foreground shadow-sm transition-all',
            'placeholder:text-transparent hover:border-slate-300',
            'focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus-visible:ring-danger/20',
            className
          )}
          {...props}
        />
        <label
          htmlFor={fieldId}
          className={cn(
            'pointer-events-none absolute start-4 top-1/2 origin-[0] -translate-y-1/2 text-sm text-muted-foreground transition-all duration-200',
            'peer-focus:top-3 peer-focus:translate-y-0 peer-focus:scale-90 peer-focus:text-primary',
            'peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:scale-90'
          )}
        >
          {label}
        </label>
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>
    )
  }
)
FloatingField.displayName = 'FloatingField'

interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ className, label, error, id, placeholder = ' ', ...props }, ref) => {
    const fieldId = id ?? props.name
    return (
      <div className="relative">
        <textarea
          id={fieldId}
          ref={ref}
          placeholder={placeholder}
          className={cn(
            'peer min-h-[140px] w-full rounded-2xl border border-input bg-card px-4 pt-6 pb-3 text-sm text-foreground shadow-sm transition-all',
            'placeholder:text-transparent hover:border-slate-300',
            'focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus-visible:ring-danger/20',
            className
          )}
          {...props}
        />
        <label
          htmlFor={fieldId}
          className={cn(
            'pointer-events-none absolute start-4 top-4 origin-[0] text-sm text-muted-foreground transition-all duration-200',
            'peer-focus:top-2.5 peer-focus:scale-90 peer-focus:text-primary',
            'peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:scale-90'
          )}
        >
          {label}
        </label>
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>
    )
  }
)
FloatingTextarea.displayName = 'FloatingTextarea'

export { FloatingField, FloatingTextarea }
