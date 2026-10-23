import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { PageHeader, PageHeaderAction } from '@/components/shared/PageHeader'
import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getModuleById } from '@/constants/navigation'
import {
  addModuleRecord,
  deleteModuleRecord,
  getModuleRecords,
  updateModuleRecord,
} from '@/utils/storage'

interface ModulePageProps {
  moduleId: string
  /** Called whenever local records change (create / update / delete) */
  onRecordsChange?: (records: Record<string, unknown>[]) => void
  /** Hide the page header when embedded inside another page */
  hideHeader?: boolean
}

type FormValues = Record<string, string>

export function ModulePage({ moduleId, onRecordsChange, hideHeader = false }: ModulePageProps) {
  const config = getModuleById(moduleId)
  const navigate = useNavigate()
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [records, setRecords] = useState<Record<string, unknown>[]>(() =>
    getModuleRecords(moduleId)
  )
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 10

  const syncRecords = (next: Record<string, unknown>[]) => {
    setRecords(next)
    onRecordsChange?.(next)
  }

  useEffect(() => {
    const next = getModuleRecords(moduleId)
    setRecords(next)
    onRecordsChange?.(next)
    setPage(1)
    setSearch('')
    setFormOpen(false)
    setDeleteOpen(false)
    setEditingId(null)
    setDeletingId(null)
    // intentionally only re-load when module changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId])

  const formFields = useMemo(
    () => (config?.columns ?? []).filter((col) => col.key !== 'id' && col.key !== 'actions'),
    [config]
  )

  const { register, handleSubmit, reset } = useForm<FormValues>()

  if (!config) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="font-display text-lg font-semibold">Module not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested module configuration is unavailable.
        </p>
      </div>
    )
  }

  const singular = config.title.replace(/s$/, '')
  const isEditing = Boolean(editingId)

  const filtered = records.filter((row) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(q))
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  const openCreate = () => {
    setEditingId(null)
    reset(Object.fromEntries(formFields.map((f) => [f.key, ''])))
    setFormOpen(true)
  }

  const openEdit = (row: Record<string, unknown>) => {
    setEditingId(String(row.id))
    reset(
      Object.fromEntries(
        formFields.map((f) => [f.key, row[f.key] == null ? '' : String(row[f.key])])
      )
    )
    setFormOpen(true)
  }

  const openDelete = (id: string) => {
    setDeletingId(id)
    setDeleteOpen(true)
  }

  const onSave = (data: FormValues) => {
    const hasValue = Object.values(data).some((v) => String(v ?? '').trim())
    if (!hasValue) {
      toast.error('Please fill at least one field')
      return
    }

    const cleaned = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, String(value ?? '').trim()])
    )

    if (editingId) {
      const next = updateModuleRecord(moduleId, editingId, cleaned)
      syncRecords(next)
      toast.success('Record updated', {
        description: `${singular} was updated successfully.`,
      })
    } else {
      const record: Record<string, unknown> = {
        id: crypto.randomUUID(),
        ...cleaned,
        createdAt: new Date().toISOString(),
      }
      const next = addModuleRecord(moduleId, record)
      syncRecords(next)
      setPage(1)
      toast.success('Record created', {
        description: `${singular} was added successfully.`,
      })
    }

    setFormOpen(false)
    setEditingId(null)
  }

  const onConfirmDelete = () => {
    if (!deletingId) return
    const next = deleteModuleRecord(moduleId, deletingId)
    syncRecords(next)
    setDeleteOpen(false)
    setDeletingId(null)
    if (page > 1 && (page - 1) * perPage >= next.length) {
      setPage(page - 1)
    }
    toast.success('Record deleted', {
      description: `${singular} was removed successfully.`,
    })
  }

  const displayColumns = [
    ...config.columns,
    { key: 'actions', label: 'Actions' },
  ]

  const displayData = paged.map((row) => ({
    id: row.id,
    ...Object.fromEntries(config.columns.map((col) => [col.key, row[col.key] ?? '—'])),
    actions: (
      <div className="flex flex-wrap items-center gap-1">
        {moduleId === 'projects' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/dashboard/projects/${String(row.id)}`)
            }}
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            openEdit(row)
          }}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-danger hover:text-danger"
          onClick={(e) => {
            e.stopPropagation()
            openDelete(String(row.id))
          }}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    ),
  }))

  return (
    <div>
      {!hideHeader && (
        <PageHeader
          title={config.title}
          description={`${config.description} Create, edit, and delete records locally.`}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: config.section },
            { label: config.title },
          ]}
          actions={
            <PageHeaderAction
              label={`Add ${singular}`}
              icon={<Plus className="h-4 w-4" />}
              onClick={openCreate}
            />
          }
        />
      )}

      {hideHeader && (
        <div className="mb-4 flex justify-end">
          <Button type="button" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add {singular}
          </Button>
        </div>
      )}

      <DataTable
        columns={displayColumns}
        data={displayData}
        loading={false}
        searchPlaceholder={config.searchPlaceholder ?? `Search ${config.title.toLowerCase()}...`}
        emptyTitle={config.emptyTitle}
        emptyDescription={`${config.emptyDescription ?? ''} Click Add to create your first record.`}
        addLabel={`Add ${singular}`}
        onAdd={openCreate}
        onExport={() =>
          toast.success('Export ready', {
            description: `${records.length} local record(s) available.`,
          })
        }
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onRowClick={
          moduleId === 'projects'
            ? (row) => navigate(`/dashboard/projects/${String(row.id)}`)
            : undefined
        }
      />

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingId(null)
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? `Edit ${singular}` : `Add ${singular}`}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update the fields below and save your changes.'
                : 'Fill the fields and save a new record.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            {formFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input id={field.key} placeholder={field.label} {...register(field.key)} />
              </div>
            ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open)
          if (!open) setDeletingId(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {singular}?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The record will be permanently removed from local
              storage.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={onConfirmDelete}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
