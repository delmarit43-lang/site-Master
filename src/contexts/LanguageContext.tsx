import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS } from '@/constants/app'
import { getMessage, type TranslationKey } from '@/i18n'
import { defaultLocale, isLocale, locales, type Locale } from '@/i18n/locales'

interface LanguageContextValue {
  locale: Locale
  dir: 'ltr' | 'rtl'
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
  languages: typeof locales
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readStoredLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEYS.language)
  return isLocale(stored) ? stored : defaultLocale
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale())

  const dir = locales.find((l) => l.code === locale)?.dir ?? 'ltr'

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
    localStorage.setItem(STORAGE_KEYS.language, locale)
  }, [locale, dir])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) =>
      getMessage(locale, key, params),
    [locale]
  )

  const value = useMemo(
    () => ({
      locale,
      dir,
      setLocale,
      t,
      languages: locales,
    }),
    [locale, dir, setLocale, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}

export function useTranslation() {
  const { t, locale, dir } = useLanguage()
  return { t, locale, dir }
}
