import { useEffect, useId, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Camera, ImagePlus, Loader2, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteProfilePhoto, useUploadProfilePhoto } from '@/hooks/useProfilePhoto'
import { cn } from '@/utils/cn'

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export interface ProfilePhotoProps {
  name?: string
  currentPhotoUrl?: string | null
  onPhotoChange?: (url: string | null) => void
  className?: string
}

interface PhotoFormValues {
  photo: FileList | null
}

function getInitials(name?: string) {
  if (!name?.trim()) return 'ED'
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function validateImageFile(file: File): string | null {
  const type = file.type.toLowerCase()
  const extensionOk = /\.(jpe?g|png|webp)$/i.test(file.name)

  if (!ACCEPTED_TYPES.includes(type) && !extensionOk) {
    return 'Only JPG, JPEG, PNG, and WEBP images are allowed.'
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Image must be 5 MB or smaller.'
  }

  return null
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read image file'))
    reader.readAsDataURL(file)
  })
}

export function ProfilePhoto({
  name,
  currentPhotoUrl,
  onPhotoChange,
  className,
}: ProfilePhotoProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [removeOpen, setRemoveOpen] = useState(false)

  const uploadMutation = useUploadProfilePhoto()
  const deleteMutation = useDeleteProfilePhoto()

  const { control, setValue, resetField } = useForm<PhotoFormValues>({
    defaultValues: { photo: null },
  })

  const displayUrl = previewUrl ?? currentPhotoUrl ?? null
  const hasSavedPhoto = Boolean(currentPhotoUrl)
  const hasDisplayPhoto = Boolean(displayUrl)
  const isBusy = uploadMutation.isPending || deleteMutation.isPending
  const initials = getInitials(name)

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const openFilePicker = () => {
    if (isBusy) return
    inputRef.current?.click()
  }

  const clearPreview = () => {
    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setPendingFile(null)
    resetField('photo')
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleFile = (fileList: FileList | null) => {
    const file = fileList?.[0]
    if (!file) return

    const error = validateImageFile(file)
    if (error) {
      toast.error('Invalid image', { description: error })
      resetField('photo')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setPendingFile(file)
    toast.message('Preview ready', {
      description: 'Review your photo, then click Upload Photo to save.',
    })
  }

  const handleUpload = async () => {
    if (!pendingFile) {
      toast.error('No photo selected', {
        description: 'Choose an image first, then upload.',
      })
      return
    }

    try {
      const result = await uploadMutation.mutateAsync(pendingFile)
      const nextUrl = result?.url || (await fileToDataUrl(pendingFile))
      clearPreview()
      onPhotoChange?.(nextUrl)
      toast.success('Photo uploaded', {
        description: 'Your profile photo was updated successfully.',
      })
    } catch {
      try {
        const dataUrl = await fileToDataUrl(pendingFile)
        clearPreview()
        onPhotoChange?.(dataUrl)
        toast.success('Photo saved locally', {
          description:
            'API unavailable — photo stored for this session. Endpoint: POST /api/profile/photo',
        })
      } catch {
        toast.error('Upload failed', {
          description: 'Could not upload your profile photo. Please try again.',
        })
      }
    }
  }

  const confirmRemove = async () => {
    try {
      if (hasSavedPhoto) {
        await deleteMutation.mutateAsync()
      }
      clearPreview()
      onPhotoChange?.(null)
      setRemoveOpen(false)
      toast.success('Photo removed', {
        description: 'Your profile photo has been removed.',
      })
    } catch {
      // Local fallback
      clearPreview()
      onPhotoChange?.(null)
      setRemoveOpen(false)
      toast.success('Photo removed', {
        description: 'Photo cleared locally. Endpoint: DELETE /api/profile/photo',
      })
    }
  }

  return (
    <>
      <Card className={cn('overflow-hidden shadow-card transition-shadow hover:shadow-soft', className)}>
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-xl">Profile Photo</CardTitle>
          <CardDescription>
            Upload a clear photo. JPG, JPEG, PNG, or WEBP — max 5 MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={openFilePicker}
                disabled={isBusy}
                aria-label="Change profile photo"
                className={cn(
                  'group relative h-40 w-40 overflow-hidden rounded-full border-4 border-card bg-muted shadow-soft ring-1 ring-border transition-all',
                  'hover:ring-2 hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  isBusy && 'cursor-not-allowed opacity-70'
                )}
              >
                {displayUrl ? (
                  <img
                    src={displayUrl}
                    alt={name ? `${name} profile photo` : 'Profile photo'}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-slate-700 font-display text-4xl font-bold text-white">
                    {initials}
                  </span>
                )}

                <span className="absolute inset-0 flex items-center justify-center bg-navy/0 transition-colors group-hover:bg-navy/35">
                  <Camera className="h-7 w-7 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                </span>

                {isBusy && (
                  <span className="absolute inset-0 flex items-center justify-center bg-navy/50">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={openFilePicker}
                disabled={isBusy}
                aria-label="Open camera / file picker"
                className={cn(
                  'absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft ring-4 ring-card transition-transform',
                  'hover:scale-105 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  isBusy && 'cursor-not-allowed opacity-70'
                )}
              >
                <Camera className="h-4 w-4" />
              </button>

              <Controller
                name="photo"
                control={control}
                render={({ field: { onChange, name: fieldName, ref } }) => (
                  <input
                    id={inputId}
                    ref={(node) => {
                      inputRef.current = node
                      ref(node)
                    }}
                    name={fieldName}
                    type="file"
                    accept={ACCEPTED_EXTENSIONS}
                    className="sr-only"
                    onChange={(event) => {
                      const files = event.target.files
                      onChange(files)
                      setValue('photo', files)
                      handleFile(files)
                    }}
                  />
                )}
              />
            </div>

            <div className="w-full flex-1 space-y-4 text-center sm:text-left">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {pendingFile
                    ? `Selected: ${pendingFile.name}`
                    : hasSavedPhoto
                      ? 'Photo on file'
                      : 'No photo uploaded yet'}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Click the avatar or camera icon to choose an image. Preview appears before upload.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={isBusy || !pendingFile}
                  className="w-full sm:w-auto"
                >
                  {uploadMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload Photo
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={openFilePicker}
                  disabled={isBusy}
                  className="w-full sm:w-auto"
                >
                  <ImagePlus className="h-4 w-4" />
                  Change Photo
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setRemoveOpen(true)}
                  disabled={isBusy || !hasDisplayPhoto}
                  className="w-full sm:w-auto"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Remove Photo
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove profile photo?</DialogTitle>
            <DialogDescription>
              This will permanently remove your current profile photo. You can upload a new one
              anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRemoveOpen(false)}
              disabled={isBusy}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmRemove}
              disabled={isBusy}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Remove Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
