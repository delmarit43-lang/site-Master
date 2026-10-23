import { STORAGE_KEYS } from '@/constants/app'
import type { CompanySettings, SecuritySettings } from '@/types'

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getCompanySettings(): CompanySettings {
  return readStorage<CompanySettings>(STORAGE_KEYS.company, {
    companyName: '',
    legalName: '',
    email: '',
    phone: '',
    website: '',
    taxId: '',
    address: '',
    city: '',
    country: '',
    currency: '',
  })
}

export function saveCompanySettings(data: CompanySettings) {
  writeStorage(STORAGE_KEYS.company, data)
}

export function getSecuritySettings(): SecuritySettings {
  return readStorage<SecuritySettings>(STORAGE_KEYS.security, {
    twoFactorEnabled: false,
    loginAlerts: false,
  })
}

export function saveSecuritySettings(data: SecuritySettings) {
  writeStorage(STORAGE_KEYS.security, data)
}

type ModuleStore = Record<string, Record<string, unknown>[]>

function readModuleStore(): ModuleStore {
  return readStorage<ModuleStore>(STORAGE_KEYS.moduleData, {})
}

export function getModuleRecords(moduleId: string): Record<string, unknown>[] {
  return readModuleStore()[moduleId] ?? []
}

export function saveModuleRecords(moduleId: string, records: Record<string, unknown>[]) {
  const store = readModuleStore()
  store[moduleId] = records
  writeStorage(STORAGE_KEYS.moduleData, store)
}

export function addModuleRecord(moduleId: string, record: Record<string, unknown>) {
  const records = getModuleRecords(moduleId)
  const next = [record, ...records]
  saveModuleRecords(moduleId, next)
  return next
}

export function getModuleRecord(moduleId: string, id: string) {
  return getModuleRecords(moduleId).find((row) => String(row.id) === String(id))
}

export function updateModuleRecord(
  moduleId: string,
  id: string,
  patch: Record<string, unknown>
) {
  const records = getModuleRecords(moduleId)
  const next = records.map((row) =>
    String(row.id) === String(id)
      ? {
          ...row,
          ...patch,
          id: row.id,
          updatedAt: new Date().toISOString(),
        }
      : row
  )
  saveModuleRecords(moduleId, next)
  return next
}

export function deleteModuleRecord(moduleId: string, id: string) {
  const records = getModuleRecords(moduleId).filter((row) => String(row.id) !== String(id))
  saveModuleRecords(moduleId, records)
  return records
}
