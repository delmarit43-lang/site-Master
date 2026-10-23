import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Camera,
  FileText,
  Flag,
  Pencil,
  Trash2,
  Truck,
  Users,
  ExternalLink,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Timeline } from '@/components/shared/Timeline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  deleteModuleRecord,
  getModuleRecord,
  updateModuleRecord,
} from '@/utils/storage'
import {
  displayCell,
  getDailyReportsForProject,
  getRecordsForProject,
  normalizeProjectStatus,
  PROJECT_STATUSES,
  projectProgress,
  projectsToTimeline,
} from '@/utils/projects'

type ProjectForm = {
  name: string
  client: string
  location: string
  status: string
  progress: string
  budget: string
  endDate: string
  startDate: string
  engineer: string
  architect: string
}

const emptyForm: ProjectForm = {
  name: '',
  client: '',
  location: '',
  status: 'Planning',
  progress: '0',
  budget: '',
  endDate: '',
  startDate: '',
  engineer: '',
  architect: '',
}

function toForm(record: Record<string, unknown>): ProjectForm {
  return {
    name: String(record.name ?? ''),
    client: String(record.client ?? ''),
    location: String(record.location ?? ''),
    status: normalizeProjectStatus(record.status),
    progress: String(record.progress ?? ''),
    budget: String(record.budget ?? ''),
    endDate: String(record.endDate ?? ''),
    startDate: String(record.startDate ?? ''),
    engineer: String(record.engineer ?? record.assignedEngineer ?? ''),
    architect: String(record.architect ?? record.assignedArchitect ?? ''),
  }
}

function LinkedTable({
  rows,
  columns,
  emptyTitle,
  emptyDescription,
  moduleHref,
}: {
  rows: Record<string, unknown>[]
  columns: { key: string; label: string }[]
  emptyTitle: string
  emptyDescription: string
  moduleHref: string
}) {
  const navigate = useNavigate()

  if (rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="Open module"
        onAction={() => navigate(moduleHref)}
      />
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)} className="border-t border-border">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-foreground">
                    {displayCell(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link to={moduleHref}>
          <ExternalLink className="h-3.5 w-3.5" />
          Manage in module
        </Link>
      </Button>
    </div>
  )
}

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<Record<string, unknown> | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm<ProjectForm>({ defaultValues: emptyForm })

  useEffect(() => {
    if (!id) {
      setProject(null)
      return
    }
    setProject(getModuleRecord('projects', id) ?? null)
  }, [id])

  const progressValue = useMemo(
    () => (project ? projectProgress(project) : 0),
    [project]
  )

  const linked = useMemo(() => {
    if (!project) {
      return {
        sites: [] as Record<string, unknown>[],
        tasks: [] as Record<string, unknown>[],
        workOrders: [] as Record<string, unknown>[],
        dailyReports: [] as Record<string, unknown>[],
        expenses: [] as Record<string, unknown>[],
        documents: [] as Record<string, unknown>[],
        invoices: [] as Record<string, unknown>[],
        equipment: [] as Record<string, unknown>[],
      }
    }
    return {
      sites: getRecordsForProject('sites', project),
      tasks: getRecordsForProject('tasks', project),
      workOrders: getRecordsForProject('work-orders', project),
      dailyReports: getDailyReportsForProject(project),
      expenses: getRecordsForProject('expenses', project),
      documents: getRecordsForProject('documents', project),
      invoices: getRecordsForProject('invoices', project),
      equipment: getRecordsForProject('equipment', project),
    }
  }, [project])

  const timelineItems = useMemo(() => {
    if (!project) return []
    const projectLine = projectsToTimeline([project])
    const taskLines = linked.tasks.slice(0, 8).map((task) => ({
      id: String(task.id),
      title: String(task.title ?? 'Task'),
      description: `${task.assignee ?? 'Unassigned'} · ${task.status ?? ''}`,
      date: String(task.dueDate ?? ''),
      status:
        String(task.status ?? '').toLowerCase().includes('complete')
          ? ('completed' as const)
          : String(task.status ?? '').toLowerCase().includes('progress')
            ? ('current' as const)
            : ('upcoming' as const),
    }))
    return [...projectLine, ...taskLines]
  }, [project, linked.tasks])

  const overviewFields = useMemo(() => {
    if (!project) return []
    return [
      { label: 'Project Name', value: String(project.name ?? '—') },
      { label: 'Client', value: String(project.client ?? '—') },
      { label: 'Location', value: String(project.location ?? '—') },
      { label: 'Budget', value: String(project.budget ?? '—') },
      { label: 'Start Date', value: String(project.startDate ?? '—') },
      { label: 'End Date', value: String(project.endDate ?? '—') },
      { label: 'Status', value: normalizeProjectStatus(project.status) },
      { label: 'Progress', value: `${progressValue}%` },
      {
        label: 'Assigned Engineer',
        value: String(project.engineer ?? project.assignedEngineer ?? '—'),
      },
      {
        label: 'Assigned Architect',
        value: String(project.architect ?? project.assignedArchitect ?? '—'),
      },
      { label: 'Linked sites', value: String(linked.sites.length) },
      { label: 'Open tasks', value: String(linked.tasks.length) },
    ]
  }, [project, progressValue, linked.sites.length, linked.tasks.length])

  const openEdit = () => {
    if (!project) return
    reset(toForm(project))
    setEditOpen(true)
  }

  const onUpdate = (data: ProjectForm) => {
    if (!id) return
    const next = updateModuleRecord('projects', id, {
      ...data,
      status: normalizeProjectStatus(data.status),
      progress: data.progress.replace('%', ''),
    })
    const updated = next.find((row) => String(row.id) === id) ?? null
    setProject(updated)
    setEditOpen(false)
    toast.success('Project updated')
  }

  const onDelete = () => {
    if (!id) return
    deleteModuleRecord('projects', id)
    setDeleteOpen(false)
    toast.success('Project deleted')
    navigate('/dashboard/projects')
  }

  if (!id || !project) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Project not found"
          description="This project may have been deleted or the link is invalid."
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Projects', href: '/dashboard/projects' },
            { label: 'Details' },
          ]}
          actions={
            <Button variant="outline" asChild>
              <Link to="/dashboard/projects">Back to projects</Link>
            </Button>
          }
        />
        <EmptyState
          title="No project data"
          description="Choose a project from the list to view details."
          actionLabel="Go to projects"
          onAction={() => navigate('/dashboard/projects')}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={String(project.name ?? 'Project Details')}
        description="Linked sites, tasks, reports, and costs for this project."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Project Management' },
          { label: 'Projects', href: '/dashboard/projects' },
          { label: String(project.name ?? 'Details') },
        ]}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/dashboard/projects">Back</Link>
            </Button>
            <Button variant="outline" onClick={openEdit}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-semibold">
                {String(project.name ?? 'Project')}
              </h2>
              <Badge variant="outline">{normalizeProjectStatus(project.status)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {String(project.client ?? '—')} · {String(project.location ?? '—')}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="secondary">{linked.sites.length} sites</Badge>
              <Badge variant="secondary">{linked.tasks.length} tasks</Badge>
              <Badge variant="secondary">{linked.workOrders.length} work orders</Badge>
              <Badge variant="secondary">{linked.dailyReports.length} reports</Badge>
            </div>
          </div>
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium tabular-nums">{progressValue}%</span>
            </div>
            <Progress value={progressValue} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="team">Sites & Team</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="daily-reports">Daily Reports</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="materials">Work Orders</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="milestones">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Project information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {overviewFields.map((field) => (
                  <div
                    key={field.label}
                    className="rounded-2xl border border-border bg-muted/30 p-4"
                  >
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {field.label}
                    </dt>
                    <dd className="mt-1 font-medium text-foreground">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline
                items={timelineItems}
                emptyTitle="No timeline events"
                emptyDescription="Project dates and linked tasks will appear here."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Linked sites</CardTitle>
            </CardHeader>
            <CardContent>
              <LinkedTable
                rows={linked.sites}
                columns={[
                  { key: 'name', label: 'Site' },
                  { key: 'location', label: 'Location' },
                  { key: 'manager', label: 'Manager' },
                  { key: 'workers', label: 'Workers' },
                  { key: 'status', label: 'Status' },
                ]}
                emptyTitle="No sites linked"
                emptyDescription="Create sites and set the Project field to this project name."
                moduleHref="/dashboard/sites"
              />
            </CardContent>
          </Card>
          {linked.sites.length === 0 && (
            <div className="mt-4">
              <EmptyState
                icon={<Users className="h-7 w-7" />}
                title="Team comes from linked sites"
                description="Site managers and workforce counts appear when sites are linked to this project."
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardContent className="pt-6">
              <LinkedTable
                rows={linked.tasks}
                columns={[
                  { key: 'title', label: 'Task' },
                  { key: 'assignee', label: 'Assignee' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'dueDate', label: 'Due' },
                  { key: 'status', label: 'Status' },
                ]}
                emptyTitle="No tasks linked"
                emptyDescription="Add tasks and set Project to this project name."
                moduleHref="/dashboard/tasks"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily-reports">
          <Card>
            <CardContent className="pt-6">
              <LinkedTable
                rows={linked.dailyReports}
                columns={[
                  { key: 'date', label: 'Date' },
                  { key: 'site', label: 'Site' },
                  { key: 'reporter', label: 'Reporter' },
                  { key: 'weather', label: 'Weather' },
                  { key: 'workforce', label: 'Workforce' },
                  { key: 'status', label: 'Status' },
                ]}
                emptyTitle="No daily reports"
                emptyDescription="Reports appear when a site linked to this project has daily reports."
                moduleHref="/dashboard/daily-reports"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="pt-6">
              {linked.documents.length === 0 ? (
                <EmptyState
                  icon={<FileText className="h-7 w-7" />}
                  title="No documents linked"
                  description="Add documents with this project name in the Documents module."
                  actionLabel="Open Documents"
                  onAction={() => navigate('/dashboard/documents')}
                />
              ) : (
                <LinkedTable
                  rows={linked.documents}
                  columns={[
                    { key: 'name', label: 'Document' },
                    { key: 'type', label: 'Type' },
                    { key: 'date', label: 'Date' },
                    { key: 'status', label: 'Status' },
                  ]}
                  emptyTitle="No documents"
                  emptyDescription=""
                  moduleHref="/dashboard/documents"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <EmptyState
            icon={<Camera className="h-7 w-7" />}
            title="Photos"
            description="Open Media Library for site photos related to this project."
            actionLabel="Open Media Library"
            onAction={() => navigate('/dashboard/media')}
          />
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardContent className="pt-6">
              <LinkedTable
                rows={linked.expenses}
                columns={[
                  { key: 'title', label: 'Expense' },
                  { key: 'category', label: 'Category' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'date', label: 'Date' },
                  { key: 'status', label: 'Status' },
                ]}
                emptyTitle="No expenses linked"
                emptyDescription="Add expenses and set Project to this project name."
                moduleHref="/dashboard/expenses"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardContent className="pt-6">
              <LinkedTable
                rows={linked.workOrders}
                columns={[
                  { key: 'number', label: 'WO #' },
                  { key: 'title', label: 'Title' },
                  { key: 'assignee', label: 'Assignee' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'dueDate', label: 'Due' },
                  { key: 'status', label: 'Status' },
                ]}
                emptyTitle="No work orders"
                emptyDescription="Create work orders linked to this project."
                moduleHref="/dashboard/work-orders"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardContent className="pt-6">
              {linked.equipment.length === 0 ? (
                <EmptyState
                  icon={<Truck className="h-7 w-7" />}
                  title="No equipment linked"
                  description="Assign equipment records with this project name."
                  actionLabel="Open Equipment"
                  onAction={() => navigate('/dashboard/equipment')}
                />
              ) : (
                <LinkedTable
                  rows={linked.equipment}
                  columns={[
                    { key: 'name', label: 'Equipment' },
                    { key: 'type', label: 'Type' },
                    { key: 'status', label: 'Status' },
                  ]}
                  emptyTitle="No equipment"
                  emptyDescription=""
                  moduleHref="/dashboard/equipment"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardContent className="pt-6">
              {linked.invoices.length === 0 ? (
                <EmptyState
                  icon={<Flag className="h-7 w-7" />}
                  title="No invoices linked"
                  description="Create invoices with this project name to track billing milestones."
                  actionLabel="Open Invoices"
                  onAction={() => navigate('/dashboard/invoices')}
                />
              ) : (
                <LinkedTable
                  rows={linked.invoices}
                  columns={[
                    { key: 'number', label: 'Invoice' },
                    { key: 'client', label: 'Client' },
                    { key: 'amount', label: 'Amount' },
                    { key: 'date', label: 'Date' },
                    { key: 'status', label: 'Status' },
                  ]}
                  emptyTitle="No invoices"
                  emptyDescription=""
                  moduleHref="/dashboard/invoices"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
            <DialogDescription>Update project fields and save changes.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
            {(
              [
                ['name', 'Project Name'],
                ['client', 'Client'],
                ['location', 'Location'],
                ['progress', 'Progress (%)'],
                ['budget', 'Budget'],
                ['startDate', 'Start Date'],
                ['endDate', 'End Date'],
                ['engineer', 'Engineer'],
                ['architect', 'Architect'],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Input id={key} {...register(key)} />
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-12 w-full rounded-2xl border border-input bg-card px-4 text-sm"
                {...register('status')}
              >
                {PROJECT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
            <DialogDescription>
              This will permanently remove “{String(project.name ?? 'this project')}”.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
