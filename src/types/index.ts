export type UserRole =
  | 'admin'
  | 'manager'
  | 'engineer'
  | 'architect'
  | 'contractor'
  | 'employee'
  | 'client'

export type ProjectStatus =
  | 'planning'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'cancelled'

export interface ApiResponse<T> {
  data: T
  message?: string
  meta?: PaginationMeta
}

export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface ListParams {
  page?: number
  perPage?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, string | number | boolean | undefined>
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  jobTitle?: string
  department?: string
  bio?: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface CompanySettings {
  companyName: string
  legalName: string
  email: string
  phone: string
  website: string
  taxId: string
  address: string
  city: string
  country: string
  currency: string
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  loginAlerts: boolean
}

export interface Project {
  id: string
  name: string
  clientId: string
  clientName?: string
  location: string
  budget: number
  startDate: string
  endDate: string
  status: ProjectStatus
  progress: number
  engineerId?: string
  engineerName?: string
  architectId?: string
  architectName?: string
  description?: string
  createdAt: string
}

export interface StatCard {
  label: string
  value: number | string
  change?: number
  icon: string
  color: string
}

export interface NavItem {
  title: string
  href?: string
  icon?: string
  children?: NavItem[]
}

export interface ModuleConfig {
  id: string
  title: string
  description: string
  path: string
  icon: string
  section: string
  columns: TableColumn[]
  searchPlaceholder?: string
  emptyTitle?: string
  emptyDescription?: string
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  className?: string
}
