export type Locale = 'en' | 'so' | 'ar'

export const locales: { code: Locale; label: string; nativeLabel: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { code: 'so', label: 'Somali', nativeLabel: 'Soomaali', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl' },
]

export const defaultLocale: Locale = 'en'

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'so' || value === 'ar'
}
