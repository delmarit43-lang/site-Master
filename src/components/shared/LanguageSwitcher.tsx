import { Check, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/utils/cn'

interface LanguageSwitcherProps {
  variant?: 'icon' | 'button'
  align?: 'start' | 'end' | 'center'
  className?: string
}

export function LanguageSwitcher({
  variant = 'icon',
  align = 'end',
  className,
}: LanguageSwitcherProps) {
  const { locale, setLocale, languages, t } = useLanguage()
  const current = languages.find((l) => l.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === 'button' ? (
          <Button variant="outline" size="sm" className={cn('gap-2', className)}>
            <Globe className="h-4 w-4" />
            <span>{current?.nativeLabel ?? t('common.language')}</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={className}
            aria-label={t('common.language')}
          >
            <Globe className="h-5 w-5" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[10rem]">
        <DropdownMenuLabel>{t('common.language')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex flex-col">
              <span className="font-medium">{lang.nativeLabel}</span>
              <span className="text-xs text-muted-foreground">{lang.label}</span>
            </span>
            {locale === lang.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
