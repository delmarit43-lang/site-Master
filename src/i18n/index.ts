import { en } from './messages/en'
import { so } from './messages/so'
import { ar } from './messages/ar'
import type { Locale } from './locales'
import type { TranslationSchema } from './messages/en'

export const messages: Record<Locale, TranslationSchema> = {
  en,
  so,
  ar,
}

type NestedKeyOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`
    }[keyof T & string]
  : never

export type TranslationKey = NestedKeyOf<TranslationSchema>

export function getMessage(locale: Locale, key: TranslationKey, params?: Record<string, string | number>) {
  const parts = key.split('.')
  let value: unknown = messages[locale]

  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = (value as Record<string, unknown>)[part]
    } else {
      value = undefined
      break
    }
  }

  if (typeof value !== 'string') {
    value = getFallback(key)
  }

  if (typeof value !== 'string') return key

  if (!params) return value

  return Object.entries(params).reduce(
    (text, [param, paramValue]) => text.replace(`{${param}}`, String(paramValue)),
    value
  )
}

function getFallback(key: TranslationKey) {
  const parts = key.split('.')
  let value: unknown = en
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = (value as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }
  return value
}
