import type { KanbanColumn } from '@/components/shared/KanbanBoard'
import type { TimelineItem } from '@/components/shared/Timeline'
import { getModuleRecords } from '@/utils/storage'

export const PROJECT_STATUSES = ['Planning', 'Active', 'On Hold', 'Completed'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

/** Normalize free-text status into one of the board columns */
export function normalizeProjectStatus(status?: unknown): ProjectStatus {
  const value = String(status ?? '').trim().toLowerCase()
  if (!value) return 'Planning'
  if (/(plan|todo|backlog|draft)/.test(value)) return 'Planning'
  if (/(hold|pause|review|wait)/.test(value)) return 'On Hold'
  if (/(complete|done|finish|closed|delivered)/.test(value)) return 'Completed'
  if (/(active|progress|ongoing|open|mobil)/.test(value)) return 'Active'
  if (PROJECT_STATUSES.includes(status as ProjectStatus)) return status as ProjectStatus
  return 'Active'
}

export function projectProgress(project: Record<string, unknown>) {
  const raw = Number(String(project.progress ?? '0').replace('%', ''))
  return Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) : 0
}

export function projectsToKanban(projects: Record<string, unknown>[]): KanbanColumn[] {
  const buckets: Record<ProjectStatus, KanbanColumn> = {
    Planning: { id: 'Planning', title: 'Planning', cards: [] },
    Active: { id: 'Active', title: 'Active', cards: [] },
    'On Hold': { id: 'On Hold', title: 'On Hold', cards: [] },
    Completed: { id: 'Completed', title: 'Completed', cards: [] },
  }

  for (const project of projects) {
    const status = normalizeProjectStatus(project.status)
    buckets[status].cards.push({
      id: String(project.id),
      title: String(project.name ?? 'Untitled project'),
      description: `${project.client ?? '—'} · ${projectProgress(project)}% · ${project.location ?? '—'}`,
    })
  }

  return PROJECT_STATUSES.map((status) => buckets[status])
}

export function projectsToTimeline(projects: Record<string, unknown>[]): TimelineItem[] {
  const sorted = [...projects].sort((a, b) => {
    const da = String(a.endDate ?? a.startDate ?? '')
    const db = String(b.endDate ?? b.startDate ?? '')
    return da.localeCompare(db)
  })

  return sorted.map((project) => {
    const status = normalizeProjectStatus(project.status)
    const timelineStatus =
      status === 'Completed'
        ? 'completed'
        : status === 'Active'
          ? 'current'
          : status === 'On Hold'
            ? 'cancelled'
            : 'upcoming'

    return {
      id: String(project.id),
      title: String(project.name ?? 'Untitled project'),
      description: `${project.client ?? '—'} · ${project.location ?? '—'} · ${status} (${projectProgress(project)}%)`,
      date: String(project.endDate ?? project.startDate ?? ''),
      status: timelineStatus,
    }
  })
}

/** Records linked to a project by name or projectId */
export function getRecordsForProject(
  moduleId: string,
  project: Record<string, unknown>
): Record<string, unknown>[] {
  const projectId = String(project.id ?? '')
  const projectName = String(project.name ?? '')

  return getModuleRecords(moduleId).filter((row) => {
    const byId = row.projectId != null && String(row.projectId) === projectId
    const byName = row.project != null && String(row.project) === projectName
    return byId || byName
  })
}

/** Daily reports are linked via site name → sites.project */
export function getDailyReportsForProject(project: Record<string, unknown>) {
  const projectName = String(project.name ?? '')
  const siteNames = new Set(
    getModuleRecords('sites')
      .filter((site) => String(site.project ?? '') === projectName)
      .map((site) => String(site.name ?? ''))
  )

  return getModuleRecords('daily-reports').filter((report) =>
    siteNames.has(String(report.site ?? ''))
  )
}

export function displayCell(value: unknown) {
  if (value == null || value === '') return '—'
  return String(value)
}
