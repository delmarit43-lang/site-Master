import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { getSecuritySettings, saveSecuritySettings } from '@/utils/storage'

const securitySchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
    twoFactorEnabled: z.boolean(),
    loginAlerts: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const changingPassword = Boolean(data.newPassword || data.confirmPassword || data.currentPassword)
    if (!changingPassword) return

    if (!data.currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Current password is required',
        path: ['currentPassword'],
      })
    }
    if (data.newPassword.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'New password must be at least 8 characters',
        path: ['newPassword'],
      })
    }
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

type SecurityFormValues = z.infer<typeof securitySchema>

export function SecuritySettingsPage() {
  const stored = useMemo(() => getSecuritySettings(), [])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: stored.twoFactorEnabled,
      loginAlerts: stored.loginAlerts,
    },
  })

  const twoFactorEnabled = watch('twoFactorEnabled')
  const loginAlerts = watch('loginAlerts')

  const onSubmit = async (data: SecurityFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    saveSecuritySettings({
      twoFactorEnabled: data.twoFactorEnabled,
      loginAlerts: data.loginAlerts,
    })

    const changedPassword = Boolean(data.newPassword)
    reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: data.twoFactorEnabled,
      loginAlerts: data.loginAlerts,
    })

    toast.success('Security settings saved', {
      description: changedPassword
        ? 'Password fields cleared. Preferences were saved locally.'
        : 'Security preferences were saved successfully.',
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Settings"
        description="Beddel furaha iyo settings-ka amniga. Update password and security preferences."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings' },
          { label: 'Security Settings' },
        ]}
      />

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Password & Authentication</CardTitle>
          <CardDescription>Update credentials and security preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter current password"
                  {...register('currentPassword')}
                />
                {errors.currentPassword && (
                  <p className="text-xs text-danger">{errors.currentPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  {...register('newPassword')}
                />
                {errors.newPassword && (
                  <p className="text-xs text-danger">{errors.newPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat new password"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-danger">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">
                    Require a second step when signing in.
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={(checked) =>
                    setValue('twoFactorEnabled', checked, { shouldDirty: true })
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Login alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Notify when a new device signs in.
                  </p>
                </div>
                <Switch
                  checked={loginAlerts}
                  onCheckedChange={(checked) =>
                    setValue('loginAlerts', checked, { shouldDirty: true })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
