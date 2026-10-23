import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { ProfilePhoto } from '@/components/profile/ProfilePhoto'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Magaca waa inuu ka kooban yahay ugu yaraan 2 xaraf / Name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().max(40, 'Phone is too long').optional(),
  jobTitle: z.string().max(100, 'Job title is too long').optional(),
  department: z.string().max(100, 'Department is too long').optional(),
  bio: z.string().max(500, 'Bio is too long').optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileSettingsPage() {
  const { user, updateUser } = useAuth()

  const defaults = useMemo<ProfileFormValues>(
    () => ({
      fullName: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      jobTitle: user?.jobTitle ?? '',
      department: user?.department ?? '',
      bio: user?.bio ?? '',
    }),
    [user]
  )

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaults,
    values: defaults,
  })

  const fullName = watch('fullName')

  const onSubmit = async (data: ProfileFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    updateUser({
      name: data.fullName,
      email: data.email,
      phone: data.phone || '',
      jobTitle: data.jobTitle || '',
      department: data.department || '',
      bio: data.bio || '',
    })
    toast.success('Profile saved', {
      description: 'Your profile details were updated successfully.',
    })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Profile Settings"
        description="Geli oo kaydi xogtaada shaqsiga ah. Enter and save your personal details."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings' },
          { label: 'Profile Settings' },
        ]}
      />

      <ProfilePhoto
        name={fullName || user?.name}
        currentPhotoUrl={user?.avatar}
        onPhotoChange={(url) => updateUser({ avatar: url || undefined })}
      />

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Buuxi foomka ka dibna riix Save Changes. Fill the form then click Save Changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" placeholder="e.g. Ahmed Ali" {...register('fullName')} />
                {errors.fullName && (
                  <p className="text-xs text-danger">{errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-danger">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+252 ..." {...register('phone')} />
                {errors.phone && (
                  <p className="text-xs text-danger">{errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g. Project Manager"
                  {...register('jobTitle')}
                />
                {errors.jobTitle && (
                  <p className="text-xs text-danger">{errors.jobTitle.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="e.g. Operations"
                  {...register('department')}
                />
                {errors.department && (
                  <p className="text-xs text-danger">{errors.department.message}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Short introduction about yourself..."
                  rows={4}
                  {...register('bio')}
                />
                {errors.bio && <p className="text-xs text-danger">{errors.bio.message}</p>}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !isDirty}>
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
