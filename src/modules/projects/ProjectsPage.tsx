import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FolderKanban,
  GanttChart,
  LayoutGrid,
  List,
  Pencil,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { ModulePage } from '@/modules/shared/ModulePage'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Timeline } from '@/components/shared/Timeline'
import { KanbanBoard } from '@/components/shared/KanbanBoard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { deleteModuleRecord, getModuleRecords, updateModuleRecord } from '@/utils/storage'
import {
  normalizeProjectStatus,
  projectProgress,
  projectsToKanban,
  projectsToTimeline,
} from '@/utils/projects'

type ViewMode = 'list' | 'grid' | 'timeline' | 'kanban'

export function ProjectsPage() {
  const navigate = useNavigate()
  const [view, setView] = useState<ViewMode>('list')
  const [projects, setProjects] = useState<Record<string, unknown>[]>(() =>
    getModuleRecords('projects')
  )

  const refresh = useCallback(() => {
    setProjects(getModuleRecords('projects'))
  }, [])

  const handleRecordsChange = useCallback((records: Record<string, unknown>[]) => {
    setProjects(records)
  }, [])

  const onDelete = (id: string) => {
    deleteModuleRecord('projects', id)
    refresh()
    toast.success('Project deleted')
  }

  const onMoveCard = (cardId: string, toColumnId: string) => {
    const status = normalizeProjectStatus(toColumnId)
    updateModuleRecord('projects', cardId, { status })
    refresh()
    toast.success('Status updated', { description: `Moved to ${status}` })
  }

  const kanbanColumns = useMemo(() => projectsToKanban(projects), [projects])
  const timelineItems = useMemo(() => projectsToTimeline(projects), [projects])

  const stats = useMemo(() => {
    const counts = {
      total: projects.length,
      active: 0,
      planning: 0,
      onHold: 0,
      completed: 0,
    }
    for (const project of projects) {
      const status = normalizeProjectStatus(project.status)
      if (status === 'Active') counts.active += 1
      if (status === 'Planning') counts.planning += 1
      if (status === 'On Hold') counts.onHold += 1
      if (status === 'Completed') counts.completed += 1
    }
    return counts
  }, [projects])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="All project views share the same data — list, grid, timeline, and board stay in sync."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Project Management' },
          { label: 'Projects' },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Planning', value: stats.planning },
          { label: 'Active', value: stats.active },
          { label: 'On Hold', value: stats.onHold },
          { label: 'Completed', value: stats.completed },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
              <p className="mt-1 font-display text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs
        value={view}
        onValueChange={(value) => {
          setView(value as ViewMode)
          refresh()
        }}
      >
        <TabsList>
          <TabsTrigger value="list" className="gap-1.5">
            <List className="h-3.5 w-3.5" />
            List
          </TabsTrigger>
          <TabsTrigger value="grid" className="gap-1.5">
            <LayoutGrid className="h-3.5 w-3.5" />
            Grid
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-1.5">
            <GanttChart className="h-3.5 w-3.5" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="kanban" className="gap-1.5">
            <LayoutGrid className="h-3.5 w-3.5" />
            Board
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <ModulePage
            moduleId="projects"
            hideHeader
            onRecordsChange={handleRecordsChange}
          />
        </TabsContent>

        <TabsContent value="grid" className="mt-4 space-y-4">
          {projects.length === 0 ? (
            <EmptyState
              title="No projects to display"
              description="Create projects in List view to see them here."
              icon={<FolderKanban className="h-7 w-7" />}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => {
                const progress = projectProgress(project)
                return (
                  <Card key={String(project.id)} className="card-hover overflow-hidden">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-base leading-snug">
                          <Link
                            to={`/dashboard/projects/${String(project.id)}`}
                            className="hover:text-primary"
                          >
                            {String(project.name ?? 'Untitled project')}
                          </Link>
                        </CardTitle>
                        <Badge variant="secondary">
                          {normalizeProjectStatus(project.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {String(project.client ?? '—')} · {String(project.location ?? '—')}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                      <p className="text-sm font-medium">{String(project.budget ?? '—')}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <Link to={`/dashboard/projects/${String(project.id)}`}>
                            <Pencil className="h-3.5 w-3.5" />
                            Open
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-danger hover:text-danger"
                          onClick={() => onDelete(String(project.id))}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Timeline
                items={timelineItems}
                emptyTitle="No projects on the timeline"
                emptyDescription="Add projects with end dates to see them here."
              />
              {timelineItems.length > 0 && (
                <div className="mt-6 space-y-2 border-t border-border pt-4">
                  {timelineItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/dashboard/projects/${item.id}`}
                      className="block text-sm text-primary hover:underline"
                    >
                      Open {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kanban" className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Move projects between columns to update status. Click a card to open details.
          </p>
          <KanbanBoard
            columns={kanbanColumns}
            onCardClick={(card) => navigate(`/dashboard/projects/${card.id}`)}
            onMoveCard={onMoveCard}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
