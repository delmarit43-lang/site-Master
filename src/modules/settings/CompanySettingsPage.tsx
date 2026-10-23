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
import { Textarea } from '@/components/ui/textarea'
import { getCompanySettings, saveCompanySettings } from '@/utils/storage'

const companySchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  legalName: z.string().max(120).optional().or(z.literal('')),
  email: z.union([z.literal(''), z.string().email('Enter a valid email')]),
  phone: z.string().max(40).optional().or(z.literal('')),
  website: z.string().max(200).optional().or(z.literal('')),
  taxId: z.string().max(60).optional().or(z.literal('')),
  address: z.string().max(300).optional().or(z.literal('')),
  city: z.string().max(80).optional().or(z.literal('')),
  country: z.string().max(80).optional().or(z.literal('')),
  currency: z.string().max(10).optional().or(z.literal('')),
})

type CompanyFormValues = z.infer<typeof companySchema>

export function CompanySettingsPage() {
  const stored = useMemo(() => getCompanySettings(), [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: stored,
  })

  const onSubmit = async (data: CompanyFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    saveCompanySettings({
      companyName: data.companyName,
      legalName: data.legalName || '',
      email: data.email || '',
      phone: data.phone || '',
      website: data.website || '',
      taxId: data.taxId || '',
      address: data.address || '',
      city: data.city || '',
      country: data.country || '',
      currency: data.currency || '',
    })
    toast.success('Company settings saved', {
      description: 'Organization details were stored successfully.',
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Settings"
        description="Geli xogta shirkadda oo kaydi. Enter and save your organization details."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings' },
          { label: 'Company Settings' },
        ]}
      />

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Organization Profile</CardTitle>
          <CardDescription>
            Buuxi foomka — xogtu waxay ku kaydsan tahay browser-kaaga ilaa API la xiro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input id="companyName" placeholder="Company name" {...register('companyName')} />
                {errors.companyName && (
                  <p className="text-xs text-danger">{errors.companyName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="legalName">Legal Name</Label>
                <Input id="legalName" placeholder="Legal registered name" {...register('legalName')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="info@company.com" {...register('email')} />
                {errors.email && (
                  <p className="text-xs text-danger">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+252 ..." {...register('phone')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://" {...register('website')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input id="taxId" placeholder="Tax / registration ID" {...register('taxId')} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Street address" rows={3} {...register('address')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="City" {...register('city')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="e.g. Somaliland" {...register('country')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Input id="currency" placeholder="e.g. USD / SLSH" {...register('currency')} />
              </div>
            </div>

            <div className="flex justify-end pt-2">
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
